# frozen_string_literal: true

require "rails_helper"

RSpec.describe ShiftOccurrenceOverride do
  around do |example|
    Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:weekly]
    Setting.payroll_period_day = "monday"
    Setting.ihss_assignment_mode = "shift"
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
    shift = create(:shift, employee: employee, calendar_event: event, ihss: false)
    [event.reload, shift]
  end

  describe "marking IHSS on one occurrence" do
    it "leaves sibling occurrences company hours" do
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

        ShiftOccurrenceOverride.set_ihss!(
          shift: shift,
          occurrence_starts_at: first.occurrence_starts_at,
          ihss: true,
        )

        refreshed = pay_period.shift_occurrences([shift.reload])
        marked = refreshed.find { |row| row.occurrence_starts_at.to_i == first.occurrence_starts_at.to_i }
        sibling = refreshed.find { |row| row.occurrence_starts_at.to_i == second.occurrence_starts_at.to_i }

        expect(marked.ihss).to be(true)
        expect(sibling.ihss).to be(false)
        expect(shift.reload.ihss).to be(false)
      end
    end

    it "clears IHSS only for that occurrence" do
      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        employee = create(:employee, :employed)
        master_starts = Time.zone.local(2024, 3, 11, 9, 0, 0)
        _event, shift = create_daily_series(employee: employee, master_starts: master_starts)
        pay_period = PayPeriod.for_period_dates(Date.new(2024, 3, 11), Date.new(2024, 3, 17))
        first, second = pay_period.shift_occurrences([shift.reload]).first(2)

        ShiftOccurrenceOverride.set_ihss!(
          shift: shift,
          occurrence_starts_at: first.occurrence_starts_at,
          ihss: true,
        )
        ShiftOccurrenceOverride.set_ihss!(
          shift: shift,
          occurrence_starts_at: second.occurrence_starts_at,
          ihss: true,
        )
        ShiftOccurrenceOverride.set_ihss!(
          shift: shift,
          occurrence_starts_at: first.occurrence_starts_at,
          ihss: false,
        )

        refreshed = pay_period.shift_occurrences([shift.reload])
        expect(refreshed.find { |row| row.occurrence_starts_at.to_i == first.occurrence_starts_at.to_i }.ihss)
          .to be(false)
        expect(refreshed.find { |row| row.occurrence_starts_at.to_i == second.occurrence_starts_at.to_i }.ihss)
          .to be(true)
      end
    end

    it "feeds hours for only the marked occurrence" do
      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        employee = create(:employee, :employed)
        master_starts = Time.zone.local(2024, 3, 11, 9, 0, 0)
        _event, shift = create_daily_series(employee: employee, master_starts: master_starts)
        pay_period = PayPeriod.for_period_dates(Date.new(2024, 3, 11), Date.new(2024, 3, 17))
        create(:timesheet, pay_period: pay_period, employee: employee)
        first = pay_period.shift_occurrences([shift.reload]).first

        ShiftOccurrenceOverride.set_ihss!(
          shift: shift,
          occurrence_starts_at: first.occurrence_starts_at,
          ihss: true,
        )

        hours = Payroll::EmployeePeriodHours.call(pay_period, [employee.id])
        summary = hours.fetch(employee.id)
        expect(summary[:ihss_hours]).to eq(8.0)
        expect(summary[:company_hours]).to be > 0
      end
    end
  end

  describe "service type on one occurrence" do
    it "leaves sibling occurrences on the master service type" do
      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        employee = create(:employee, :employed)
        overnight = ServiceType.find_or_create_by!(name: "Overnight") do |row|
          row.color = "#15803D"
          row.billable = true
          row.payable = true
        end
        master_starts = Time.zone.local(2024, 3, 11, 9, 0, 0)
        _event, shift = create_daily_series(employee: employee, master_starts: master_starts)
        master_service_type_id = shift.service_type_id
        pay_period = PayPeriod.for_period_dates(Date.new(2024, 3, 11), Date.new(2024, 3, 17))
        first, second = pay_period.shift_occurrences([shift.reload]).first(2)

        ShiftOccurrenceOverride.set_service_type!(
          shift: shift,
          occurrence_starts_at: first.occurrence_starts_at,
          service_type: overnight,
        )

        refreshed = pay_period.shift_occurrences([shift.reload])
        marked = refreshed.find { |row| row.occurrence_starts_at.to_i == first.occurrence_starts_at.to_i }
        sibling = refreshed.find { |row| row.occurrence_starts_at.to_i == second.occurrence_starts_at.to_i }

        expect(marked.service_type_id).to eq(overnight.id)
        expect(sibling.service_type_id).to eq(master_service_type_id)
        expect(shift.reload.service_type_id).to eq(master_service_type_id)
      end
    end
  end

  describe "Calendar::Recurring sync" do
    it "removes the override when CancelOccurrence hides the slot" do
      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        employee = create(:employee, :employed)
        master_starts = Time.zone.local(2024, 3, 11, 9, 0, 0)
        event, shift = create_daily_series(employee: employee, master_starts: master_starts)
        pay_period = PayPeriod.for_period_dates(Date.new(2024, 3, 11), Date.new(2024, 3, 17))
        slot = pay_period.shift_occurrences([shift.reload]).first.occurrence_starts_at
        ShiftOccurrenceOverride.set_ihss!(shift: shift, occurrence_starts_at: slot, ihss: true)

        Calendar::Recurring::CancelOccurrence.call(event, occurrence_starts_at: slot)

        expect(ShiftOccurrenceOverride.where(shift_id: shift.id)).to be_empty
      end
    end

    it "remaps override keys on edit-all time delta" do
      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        employee = create(:employee, :employed)
        master_starts = Time.zone.local(2024, 3, 11, 9, 0, 0)
        event, shift = create_daily_series(employee: employee, master_starts: master_starts)
        pay_period = PayPeriod.for_period_dates(Date.new(2024, 3, 11), Date.new(2024, 3, 17))
        slot = pay_period.shift_occurrences([shift.reload]).first.occurrence_starts_at
        ShiftOccurrenceOverride.set_ihss!(shift: shift, occurrence_starts_at: slot, ihss: true)

        Calendar::Recurring::ApplyOccurrenceEdit.call(
          event,
          attrs: {
            starts_at: slot + 1.hour,
            ends_at: slot + 9.hours,
          },
          edit_scope: "all",
          occurrence_starts_at: slot,
        )

        remapped = ShiftOccurrenceOverride.find_by!(shift_id: shift.id)
        expect(remapped.occurrence_starts_at.to_i).to eq((slot + 1.hour).to_i)
        expect(remapped.ihss).to be(true)
      end
    end
  end

  describe "non-recurring" do
    it "stores IHSS on the single occurrence override without flipping the master column" do
      employee = create(:employee, :employed)
      event = create(
        :calendar_event,
        starts_at: Time.zone.local(2024, 3, 12, 9, 0, 0),
        ends_at: Time.zone.local(2024, 3, 12, 17, 0, 0),
      )
      shift = create(:shift, employee: employee, calendar_event: event, ihss: false)
      pay_period = PayPeriod.for_period_dates(Date.new(2024, 3, 11), Date.new(2024, 3, 17))

      ShiftOccurrenceOverride.set_ihss!(
        shift: shift,
        occurrence_starts_at: event.starts_at,
        ihss: true,
      )

      expect(shift.reload.ihss).to be(false)
      occurrence = pay_period.shift_occurrences([shift.reload]).sole
      expect(occurrence.ihss).to be(true)
    end
  end
end
