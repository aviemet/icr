# frozen_string_literal: true

require "rails_helper"

RSpec.describe ShiftOccurrenceApproval do
  around do |example|
    Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:weekly]
    Setting.payroll_period_day = "monday"
    example.run
  end

  def create_daily_series(employee:, master_starts:)
    event = create(
      :calendar_event,
      starts_at: master_starts,
      ends_at: master_starts + 8.hours,
    )
    create(
      :calendar_recurring_pattern,
      calendar_event: event,
      recurring_type: :daily,
      offset: 1,
      end_date: nil,
    )
    shift = create(:shift, employee: employee, calendar_event: event)
    [event.reload, shift]
  end

  describe "approve one occurrence" do
    it "leaves sibling occurrences pending" do
      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        employee = create(:employee, :employed)
        master_starts = Time.zone.local(2024, 3, 11, 9, 0, 0)
        _event, shift = create_daily_series(employee: employee, master_starts: master_starts)
        pay_period = PayPeriod.for_period_dates(Date.new(2024, 3, 11), Date.new(2024, 3, 17))
        create(:timesheet, pay_period: pay_period, employee: employee)

        occurrences = pay_period.shift_occurrences([shift.reload])
        expect(occurrences.size).to be >= 2

        first = occurrences.first
        second = occurrences.second
        described_class.approve!(
          shift: shift,
          occurrence_starts_at: first.occurrence_starts_at,
        )

        refreshed = pay_period.shift_occurrences([shift.reload])
        approved = refreshed.find { |row| row.occurrence_starts_at.to_i == first.occurrence_starts_at.to_i }
        sibling = refreshed.find { |row| row.occurrence_starts_at.to_i == second.occurrence_starts_at.to_i }

        expect(approved).to be_facilitator_approved
        expect(sibling).not_to be_facilitator_approved
      end
    end

    it "unapproves only that slot" do
      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        employee = create(:employee, :employed)
        master_starts = Time.zone.local(2024, 3, 11, 9, 0, 0)
        _event, shift = create_daily_series(employee: employee, master_starts: master_starts)
        pay_period = PayPeriod.for_period_dates(Date.new(2024, 3, 11), Date.new(2024, 3, 17))

        occurrences = pay_period.shift_occurrences([shift.reload])
        first = occurrences.first
        second = occurrences.second
        described_class.approve!(shift: shift, occurrence_starts_at: first.occurrence_starts_at)
        described_class.approve!(shift: shift, occurrence_starts_at: second.occurrence_starts_at)
        described_class.unapprove!(shift: shift, occurrence_starts_at: first.occurrence_starts_at)

        refreshed = pay_period.shift_occurrences([shift.reload])
        expect(refreshed.find { |row| row.occurrence_starts_at.to_i == first.occurrence_starts_at.to_i })
          .not_to be_facilitator_approved
        expect(refreshed.find { |row| row.occurrence_starts_at.to_i == second.occurrence_starts_at.to_i })
          .to be_facilitator_approved
      end
    end
  end

  describe "Calendar::Recurring sync" do
    it "removes approval when CancelOccurrence hides the slot" do
      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        employee = create(:employee, :employed)
        master_starts = Time.zone.local(2024, 3, 11, 9, 0, 0)
        event, shift = create_daily_series(employee: employee, master_starts: master_starts)
        pay_period = PayPeriod.for_period_dates(Date.new(2024, 3, 11), Date.new(2024, 3, 17))
        slot = pay_period.shift_occurrences([shift.reload]).first.occurrence_starts_at
        described_class.approve!(shift: shift, occurrence_starts_at: slot)

        Calendar::Recurring::CancelOccurrence.call(event, occurrence_starts_at: slot)

        expect(described_class.where(shift_id: shift.id)).to be_empty
      end
    end

    it "removes approval on just-this edit and leaves the detached shift unapproved" do
      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        employee = create(:employee, :employed)
        master_starts = Time.zone.local(2024, 3, 11, 9, 0, 0)
        event, shift = create_daily_series(employee: employee, master_starts: master_starts)
        pay_period = PayPeriod.for_period_dates(Date.new(2024, 3, 11), Date.new(2024, 3, 17))
        slot = pay_period.shift_occurrences([shift.reload]).first.occurrence_starts_at
        described_class.approve!(shift: shift, occurrence_starts_at: slot)

        expect {
          Calendar::Recurring::ApplyOccurrenceEdit.call(
            event,
            attrs: {
              starts_at: slot + 1.day,
              ends_at: slot + 1.day + 8.hours,
            },
            edit_scope: "one",
            occurrence_starts_at: slot,
          )
        }.to change(Calendar::Event, :count).by(1)

        expect(
          described_class.where(
            shift_id: shift.id,
            occurrence_starts_at: described_class.normalize_occurrence_starts_at(slot),
          ),
        ).to be_empty
        detached = Calendar::Event.order(:created_at).last
        expect(detached.shift.occurrence_approvals).to be_empty
      end
    end

    it "remaps approval keys on edit-all time delta" do
      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        employee = create(:employee, :employed)
        master_starts = Time.zone.local(2024, 3, 11, 9, 0, 0)
        event, shift = create_daily_series(employee: employee, master_starts: master_starts)
        pay_period = PayPeriod.for_period_dates(Date.new(2024, 3, 11), Date.new(2024, 3, 17))
        slot = pay_period.shift_occurrences([shift.reload]).first.occurrence_starts_at
        described_class.approve!(shift: shift, occurrence_starts_at: slot)
        expect(described_class.where(shift_id: shift.id).count).to eq(1)

        Calendar::Recurring::ApplyOccurrenceEdit.call(
          event,
          attrs: {
            starts_at: slot + 1.hour,
            ends_at: slot + 9.hours,
          },
          edit_scope: "all",
          occurrence_starts_at: slot,
        )

        expect(described_class.where(shift_id: shift.id).count).to eq(1)
        remapped = described_class.find_by!(shift_id: shift.id)
        expect(remapped.occurrence_starts_at.to_i).to eq((slot + 1.hour).to_i)
      end
    end
  end

  describe "PeriodSummary" do
    it "counts pending using sparse occurrence stamps" do
      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        employee = create(:employee, :employed)
        master_starts = Time.zone.local(2024, 3, 11, 9, 0, 0)
        _event, shift = create_daily_series(employee: employee, master_starts: master_starts)
        pay_period = PayPeriod.for_period_dates(Date.new(2024, 3, 11), Date.new(2024, 3, 17))
        create(:timesheet, pay_period: pay_period, employee: employee)

        occurrences = pay_period.shift_occurrences([shift.reload])
        described_class.approve!(
          shift: shift,
          occurrence_starts_at: occurrences.first.occurrence_starts_at,
        )

        counts = Payroll::PeriodSummary.new(pay_period, employee_ids: [employee.id]).show_counts
        expect(counts[:facilitator_pending_shift_count]).to eq(occurrences.size - 1)
      end
    end
  end

  describe "non-recurring" do
    it "approves and unapproves via the sparse table" do
      employee = create(:employee, :employed)
      event = create(
        :calendar_event,
        starts_at: Time.zone.local(2024, 3, 12, 9, 0, 0),
        ends_at: Time.zone.local(2024, 3, 12, 17, 0, 0),
      )
      shift = create(:shift, employee: employee, calendar_event: event)

      described_class.approve!(shift: shift, occurrence_starts_at: event.starts_at)
      expect(shift.occurrence_approvals.count).to eq(1)

      described_class.unapprove!(shift: shift, occurrence_starts_at: event.starts_at)
      expect(shift.occurrence_approvals).to be_empty
    end
  end
end
