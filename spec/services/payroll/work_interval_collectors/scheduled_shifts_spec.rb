# frozen_string_literal: true

require "rails_helper"

RSpec.describe Payroll::WorkIntervalCollectors::ScheduledShifts do
  around do |example|
    Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:semi_monthly]
    example.run
  end

  def pay_period_for(starts_on, ends_on)
    PayPeriod.for_period_dates(starts_on, ends_on)
  end

  it "collects a non-recurring shift attached to the period timesheet" do
    pay_period = pay_period_for(Date.new(2026, 11, 16), Date.new(2026, 11, 30))
    employee = create(:employee)
    timesheet = create(:timesheet, pay_period:, employee:)
    event = create(
      :calendar_event,
      starts_at: Time.zone.local(2026, 11, 18, 9, 0, 0),
      ends_at: Time.zone.local(2026, 11, 18, 17, 0, 0),
    )
    shift = create(:shift, employee:, timesheet:, calendar_event: event)

    intervals = described_class.new.intervals_for(pay_period:, employee_ids: [employee.id])

    expect(intervals.length).to eq(1)
    expect(intervals.first.id).to eq(shift.id)
    expect(intervals.first.starts_at).to eq(event.starts_at)
    expect(intervals.first.duration_hours).to eq(8.0)
  end

  it "expands recurring masters into work intervals for later pay periods" do
    pay_period = pay_period_for(Date.new(2026, 11, 16), Date.new(2026, 11, 30))
    employee = create(:employee)
    master = create(
      :calendar_event,
      starts_at: Time.zone.local(2026, 10, 1, 9, 0, 0),
      ends_at: Time.zone.local(2026, 10, 1, 17, 0, 0),
    )
    create(
      :calendar_recurring_pattern,
      calendar_event: master,
      recurring_type: :weekly,
      offset: 1,
      day_of_week: 1,
      end_date: nil,
      max_occurrences: nil,
    )
    shift = create(:shift, employee:, calendar_event: master)
    master.reload

    intervals = described_class.new.intervals_for(pay_period:, employee_ids: [employee.id])

    expect(intervals.length).to eq(3)
    expect(intervals.map(&:starts_at)).to eq([
      Time.zone.local(2026, 11, 16, 9, 0, 0),
      Time.zone.local(2026, 11, 23, 9, 0, 0),
      Time.zone.local(2026, 11, 30, 9, 0, 0),
    ])
    expect(intervals.map(&:employee_id).uniq).to eq([employee.id])
    expect(intervals.map(&:id)).to all(start_with("#{shift.id}:"))
  end

  it "omits cancelled recurring occurrences from collected intervals" do
    pay_period = pay_period_for(Date.new(2026, 11, 16), Date.new(2026, 11, 30))
    employee = create(:employee)
    master = create(
      :calendar_event,
      starts_at: Time.zone.local(2026, 11, 16, 9, 0, 0),
      ends_at: Time.zone.local(2026, 11, 16, 17, 0, 0),
    )
    create(
      :calendar_recurring_pattern,
      calendar_event: master,
      recurring_type: :weekly,
      offset: 1,
      day_of_week: 1,
      end_date: nil,
      max_occurrences: nil,
    )
    create(
      :calendar_event_exception,
      calendar_event: master,
      cancelled: Time.zone.local(2026, 11, 23, 9, 0, 0),
      rescheduled: nil,
    )
    create(:shift, employee:, calendar_event: master)
    master.reload

    intervals = described_class.new.intervals_for(pay_period:, employee_ids: [employee.id])

    expect(intervals.map(&:starts_at)).to eq([
      Time.zone.local(2026, 11, 16, 9, 0, 0),
      Time.zone.local(2026, 11, 30, 9, 0, 0),
    ])
  end

  it "does not invent intervals for employees outside the requested set" do
    pay_period = pay_period_for(Date.new(2026, 11, 16), Date.new(2026, 11, 30))
    included = create(:employee)
    excluded = create(:employee)
    master = create(
      :calendar_event,
      starts_at: Time.zone.local(2026, 10, 1, 9, 0, 0),
      ends_at: Time.zone.local(2026, 10, 1, 17, 0, 0),
    )
    create(
      :calendar_recurring_pattern,
      calendar_event: master,
      recurring_type: :weekly,
      offset: 1,
      day_of_week: 1,
      end_date: nil,
      max_occurrences: nil,
    )
    create(:shift, employee: included, calendar_event: master)
    other = create(
      :calendar_event,
      starts_at: Time.zone.local(2026, 10, 1, 10, 0, 0),
      ends_at: Time.zone.local(2026, 10, 1, 18, 0, 0),
    )
    create(
      :calendar_recurring_pattern,
      calendar_event: other,
      recurring_type: :weekly,
      offset: 1,
      day_of_week: 1,
      end_date: nil,
      max_occurrences: nil,
    )
    create(:shift, employee: excluded, calendar_event: other)

    intervals = described_class.new.intervals_for(pay_period:, employee_ids: [included.id])

    expect(intervals.map(&:employee_id).uniq).to eq([included.id])
  end
end
