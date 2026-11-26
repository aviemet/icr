# frozen_string_literal: true

require "rails_helper"

RSpec.describe Payroll::IhssToggleRefresh do
  around do |example|
    Setting.ihss_assignment_mode = "shift"
    Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:weekly]
    Setting.payroll_period_day = "monday"
    travel_to(Time.zone.local(2024, 3, 20, 12, 0, 0)) { example.run }
  end

  let(:pay_period) { PayPeriod.for_period_dates(Date.new(2024, 3, 11), Date.new(2024, 3, 17)) }
  let(:employee) { create(:employee, :employed) }
  let(:client) { create(:client) }
  let(:timesheet) { create(:timesheet, pay_period: pay_period, employee: employee) }

  def shift_for(participant, starts_at:, hours:, shift_employee: employee, recurring: false)
    event = create(:calendar_event, starts_at: starts_at, ends_at: starts_at + hours.hours)
    if recurring
      create(:calendar_recurring_pattern, calendar_event: event, recurring_type: :daily, offset: 1, end_date: nil)
    end
    event.event_participants.create!(participant: participant)
    shift_timesheet = shift_employee == employee ? timesheet : create(:timesheet, pay_period: pay_period, employee: shift_employee)
    create(:shift, employee: shift_employee, timesheet: shift_timesheet, calendar_event: event, ihss: false)
  end

  def toggle(shift, occurrence_starts_at, ihss:)
    ShiftOccurrenceOverride.set_ihss!(shift: shift, occurrence_starts_at: occurrence_starts_at, ihss: ihss)
    described_class.call(
      pay_period: pay_period,
      shift: shift,
      occurrence_starts_at: occurrence_starts_at,
      ihss: ihss,
      client_id: client.id,
    )
  end

  it "returns the occurrence id and keeps sibling occurrence flags distinct" do
    shift = shift_for(client, starts_at: Time.zone.local(2024, 3, 11, 9, 0, 0), hours: 8, recurring: true)
    first, second = pay_period.shift_occurrences([shift.reload]).first(2)

    delta = toggle(shift, first.occurrence_starts_at, ihss: true)

    expect(delta[:id]).to eq(first.id.to_s)
    expect(delta[:ihss]).to be(true)
    by_id = pay_period.shift_occurrences([shift.reload]).index_by { |row| row.id.to_s }
    expect(by_id.fetch(first.id.to_s).ihss).to be(true)
    expect(by_id.fetch(second.id.to_s).ihss).to be(false)
  end

  it "matches the page's per-employee hours, which include the employee's shifts for other clients" do
    other_client = create(:client)
    shift = shift_for(client, starts_at: Time.zone.local(2024, 3, 12, 8, 0, 0), hours: 6)
    shift_for(other_client, starts_at: Time.zone.local(2024, 3, 12, 15, 0, 0), hours: 6)

    delta = toggle(shift, shift.starts_at, ihss: false)
    page_hours = Payroll::EmployeePeriodHours.call(pay_period, [employee.id])[employee.id.to_s]

    expect(delta[:employee_hours]).to eq(page_hours.except(:shift_ot_hours))
    expect(delta[:employee_hours][:ot_hours]).to eq(4.0)
    expect(delta[:shift_ot_hours]).to eq(page_hours[:shift_ot_hours].transform_values(&:to_f))
  end

  it "zero-fills OT for occurrences that leave the OT-eligible set" do
    Setting.ihss_co_employer = false
    shift = shift_for(client, starts_at: Time.zone.local(2024, 3, 12, 8, 0, 0), hours: 10)

    before = toggle(shift, shift.starts_at, ihss: false)
    after = toggle(shift, shift.starts_at, ihss: true)

    expect(before[:shift_ot_hours][shift.id.to_s]).to eq(2.0)
    expect(after[:shift_ot_hours]).to eq(shift.id.to_s => 0.0)
  ensure
    Setting.ihss_co_employer = true
  end

  it "recomputes hours for the toggled employee only" do
    other_employee = create(:employee, :employed)
    shift = shift_for(client, starts_at: Time.zone.local(2024, 3, 12, 8, 0, 0), hours: 4)
    other_shift = shift_for(client, starts_at: Time.zone.local(2024, 3, 13, 8, 0, 0), hours: 4, shift_employee: other_employee)

    delta = toggle(shift, shift.starts_at, ihss: true)

    expect(delta[:shift_ot_hours].keys).to eq([shift.id.to_s])
    expect(delta[:shift_ot_hours]).not_to have_key(other_shift.id.to_s)
  end

  it "reports client IHSS hours used with the same service the page uses" do
    shift = shift_for(client, starts_at: Time.zone.local(2024, 3, 12, 8, 0, 0), hours: 4)

    delta = toggle(shift, shift.starts_at, ihss: true)

    expect(delta[:ihss_hours_used]).to eq(4.0)
    expect(delta[:ihss_hours_used]).to eq(
      Payroll::ClientPeriodIhssHours.call(pay_period: pay_period, client_ids: [client.id])[client.id.to_s],
    )
  end
end
