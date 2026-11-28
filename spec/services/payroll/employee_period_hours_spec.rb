# frozen_string_literal: true

require "rails_helper"

RSpec.describe Payroll::EmployeePeriodHours do
  before do
    Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:weekly]
    Setting.payroll_period_day = "monday"
    Setting.overtime_weekly_hours = 40
    Setting.overtime_daily_hours = 8
  end

  def pay_period_for(date)
    period_start, period_end = Payroll::Period.period_dates(date)
    PayPeriod.for_period_dates(period_start, period_end)
  end

  describe ".call" do
    it "returns empty hash when employee_ids is empty" do
      pay_period = pay_period_for(Date.new(2024, 3, 15))

      result = described_class.call(pay_period, [])

      expect(result).to eq({})
    end

    it "returns regular_hours, ot_hours, and shift_ot_hours for an employee with one same-day shift" do
      pay_period = pay_period_for(Date.new(2024, 3, 15))
      employee = create(:employee)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      event = create(:calendar_event, starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0), ends_at: Time.zone.local(2024, 3, 15, 17, 0, 0))
      shift = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)

      result = described_class.call(pay_period, [employee.id])

      expect(result).to have_key(employee.id.to_s)
      expect(result[employee.id.to_s][:regular_hours]).to eq(8.0)
      expect(result[employee.id.to_s][:ot_hours]).to eq(0.0)
      expect(result[employee.id.to_s][:shift_ot_hours]).to eq(shift.id.to_s => 0.0)
      expect(result[employee.id.to_s][:pto_hours]).to eq(0.0)
      expect(result[employee.id.to_s][:sick_hours]).to eq(0.0)
    end

    it "classifies vacation and sick leave separately and excludes them from OT pools" do
      pay_period = pay_period_for(Date.new(2024, 3, 15))
      employee = create(:employee)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      vacation = ServiceType.find_or_create_by!(slug: "vacation") do |service_type|
        service_type.name = "Vacation"
        service_type.system = true
        service_type.billable = false
        service_type.payable = true
        service_type.color = "#B45309"
        service_type.position = 0
      end
      sick = ServiceType.find_or_create_by!(slug: "sick") do |service_type|
        service_type.name = "Sick"
        service_type.system = true
        service_type.billable = false
        service_type.payable = true
        service_type.color = "#BE123C"
        service_type.position = 1
      end
      work_event = create(:calendar_event, starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0), ends_at: Time.zone.local(2024, 3, 15, 17, 0, 0))
      create(:shift, employee: employee, timesheet: timesheet, calendar_event: work_event)
      pto_event = create(:calendar_event, starts_at: Time.zone.local(2024, 3, 14, 9, 0, 0), ends_at: Time.zone.local(2024, 3, 14, 17, 0, 0))
      create(:shift, employee: employee, timesheet: timesheet, calendar_event: pto_event, service_type: vacation)
      sick_event = create(:calendar_event, starts_at: Time.zone.local(2024, 3, 13, 9, 0, 0), ends_at: Time.zone.local(2024, 3, 13, 13, 0, 0))
      create(:shift, employee: employee, timesheet: timesheet, calendar_event: sick_event, service_type: sick)

      result = described_class.call(pay_period, [employee.id])[employee.id.to_s]

      expect(result[:regular_hours]).to eq(8.0)
      expect(result[:ot_hours]).to eq(0.0)
      expect(result[:pto_hours]).to eq(8.0)
      expect(result[:sick_hours]).to eq(4.0)
      expect(result[:company_hours]).to eq(8.0)
    end

    it "splits overnight shift across two days and applies threshold OT only after daily totals exceed 8" do
      pay_period = pay_period_for(Date.new(2024, 3, 15))
      employee = create(:employee)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      event = create(:calendar_event, starts_at: Time.zone.local(2024, 3, 15, 22, 0, 0), ends_at: Time.zone.local(2024, 3, 16, 6, 0, 0))
      shift = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)

      result = described_class.call(pay_period, [employee.id])

      expect(result[employee.id.to_s][:regular_hours]).to eq(8.0)
      expect(result[employee.id.to_s][:ot_hours]).to eq(0.0)
      expect(result[employee.id.to_s][:shift_ot_hours][shift.id.to_s]).to eq(0.0)
    end

    it "attributes daily OT on the morning side of an overnight shift that exceeds the daily threshold" do
      pay_period = pay_period_for(Date.new(2024, 3, 15))
      employee = create(:employee)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      event = create(
        :calendar_event,
        starts_at: Time.zone.local(2024, 3, 15, 20, 0, 0),
        ends_at: Time.zone.local(2024, 3, 16, 10, 0, 0),
      )
      shift = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)

      result = described_class.call(pay_period, [employee.id])

      expect(result[employee.id.to_s][:regular_hours]).to eq(12.0)
      expect(result[employee.id.to_s][:ot_hours]).to eq(2.0)
      expect(result[employee.id.to_s][:shift_ot_hours][shift.id.to_s]).to eq(2.0)
    end

    it "treats an evening shift that ends at midnight as regular when the day stays at 8 hours" do
      pay_period = pay_period_for(Date.new(2024, 3, 15))
      employee = create(:employee)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      event = create(
        :calendar_event,
        starts_at: Time.zone.local(2024, 3, 15, 16, 0, 0),
        ends_at: Time.zone.local(2024, 3, 16, 0, 0, 0),
      )
      shift = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)

      result = described_class.call(pay_period, [employee.id])

      expect(result[employee.id.to_s][:regular_hours]).to eq(8.0)
      expect(result[employee.id.to_s][:ot_hours]).to eq(0.0)
      expect(result[employee.id.to_s][:shift_ot_hours][shift.id.to_s]).to eq(0.0)
    end

    it "includes shift_ot_hours for the shift when daily threshold is exceeded" do
      pay_period = pay_period_for(Date.new(2024, 3, 15))
      employee = create(:employee)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      event = create(:calendar_event, starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0), ends_at: Time.zone.local(2024, 3, 15, 19, 0, 0))
      shift = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)

      result = described_class.call(pay_period, [employee.id])

      expect(result[employee.id.to_s][:shift_ot_hours][shift.id.to_s]).to eq(2.0)
    end

    it "attributes daily shift OT chronologically after the daily threshold" do
      pay_period = pay_period_for(Date.new(2024, 3, 15))
      employee = create(:employee)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      event1 = create(:calendar_event, starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0), ends_at: Time.zone.local(2024, 3, 15, 14, 0, 0))
      event2 = create(:calendar_event, starts_at: Time.zone.local(2024, 3, 15, 14, 0, 0), ends_at: Time.zone.local(2024, 3, 15, 19, 0, 0))
      shift1 = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event1)
      shift2 = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event2)

      result = described_class.call(pay_period, [employee.id])

      expect(result[employee.id.to_s][:shift_ot_hours][shift1.id.to_s]).to eq(0.0)
      expect(result[employee.id.to_s][:shift_ot_hours][shift2.id.to_s]).to eq(2.0)
    end

    it "does not infinite loop when processing shifts" do
      pay_period = pay_period_for(Date.new(2024, 3, 15))
      employee = create(:employee)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      event = create(:calendar_event, starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0), ends_at: Time.zone.local(2024, 3, 15, 17, 0, 0))
      create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)

      result = nil
      expect { result = described_class.call(pay_period, [employee.id]) }.not_to raise_error
      expect(result).to be_a(Hash)
      expect(result[employee.id.to_s]).to include(:regular_hours, :ot_hours, :shift_ot_hours)
    end

    it "can compute hours from a collector without timesheets or shifts" do
      pay_period = pay_period_for(Date.new(2024, 3, 15))
      employee = create(:employee)

      interval = Payroll::WorkInterval.new(
        employee_id: employee.id,
        starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0),
        ends_at: Time.zone.local(2024, 3, 15, 18, 0, 0),
        category: nil,
      )

      collector = stub_collector([interval])

      result = described_class.call(pay_period, [employee.id], collector: collector)

      expect(result[employee.id.to_s][:regular_hours]).to eq(8.0)
      expect(result[employee.id.to_s][:ot_hours]).to eq(1.0)
      expect(result[employee.id.to_s][:ihss_hours]).to eq(0.0)
      expect(result[employee.id.to_s][:company_hours]).to eq(9.0)
    end

    it "applies weekly OT when a week exceeds the weekly threshold without daily OT" do
      pay_period = pay_period_for(Date.new(2024, 3, 11))
      employee = create(:employee)
      intervals = (0..5).map do |day_offset|
        date = Date.new(2024, 3, 11) + day_offset
        Payroll::WorkInterval.new(
          id: SecureRandom.uuid,
          employee_id: employee.id,
          starts_at: Time.zone.local(date.year, date.month, date.day, 9, 0, 0),
          ends_at: Time.zone.local(date.year, date.month, date.day, 17, 0, 0),
          category: nil,
        )
      end

      result = described_class.call(pay_period, [employee.id], collector: stub_collector(intervals))

      expect(result[employee.id.to_s][:regular_hours]).to eq(40.0)
      expect(result[employee.id.to_s][:ot_hours]).to eq(8.0)
    end

    it "attributes weekly shift OT chronologically after the weekly threshold" do
      pay_period = pay_period_for(Date.new(2024, 3, 11))
      employee = create(:employee)
      intervals = (0..6).map do |day_offset|
        date = Date.new(2024, 3, 11) + day_offset
        Payroll::WorkInterval.new(
          id: "day-#{day_offset}",
          employee_id: employee.id,
          starts_at: Time.zone.local(date.year, date.month, date.day, 9, 0, 0),
          ends_at: Time.zone.local(date.year, date.month, date.day, 17, 0, 0),
          category: nil,
        )
      end

      result = described_class.call(pay_period, [employee.id], collector: stub_collector(intervals))
      shift_ot = result[employee.id.to_s][:shift_ot_hours]

      expect(result[employee.id.to_s][:ot_hours]).to eq(16.0)
      expect(shift_ot["day-0"]).to eq(0.0)
      expect(shift_ot["day-1"]).to eq(0.0)
      expect(shift_ot["day-2"]).to eq(0.0)
      expect(shift_ot["day-3"]).to eq(0.0)
      expect(shift_ot["day-4"]).to eq(0.0)
      expect(shift_ot["day-5"]).to eq(8.0)
      expect(shift_ot["day-6"]).to eq(8.0)
    end

    it "attributes partial weekly OT on the shift that crosses the weekly threshold" do
      pay_period = pay_period_for(Date.new(2024, 3, 11))
      employee = create(:employee)
      intervals = [
        Payroll::WorkInterval.new(
          id: "mon",
          employee_id: employee.id,
          starts_at: Time.zone.local(2024, 3, 11, 9, 0, 0),
          ends_at: Time.zone.local(2024, 3, 11, 17, 0, 0),
          category: nil,
        ),
        Payroll::WorkInterval.new(
          id: "tue",
          employee_id: employee.id,
          starts_at: Time.zone.local(2024, 3, 12, 9, 0, 0),
          ends_at: Time.zone.local(2024, 3, 12, 17, 0, 0),
          category: nil,
        ),
        Payroll::WorkInterval.new(
          id: "wed",
          employee_id: employee.id,
          starts_at: Time.zone.local(2024, 3, 13, 9, 0, 0),
          ends_at: Time.zone.local(2024, 3, 13, 17, 0, 0),
          category: nil,
        ),
        Payroll::WorkInterval.new(
          id: "thu",
          employee_id: employee.id,
          starts_at: Time.zone.local(2024, 3, 14, 9, 0, 0),
          ends_at: Time.zone.local(2024, 3, 14, 17, 0, 0),
          category: nil,
        ),
        Payroll::WorkInterval.new(
          id: "fri",
          employee_id: employee.id,
          starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0),
          ends_at: Time.zone.local(2024, 3, 15, 17, 0, 0),
          category: nil,
        ),
        Payroll::WorkInterval.new(
          id: "sat",
          employee_id: employee.id,
          starts_at: Time.zone.local(2024, 3, 16, 9, 0, 0),
          ends_at: Time.zone.local(2024, 3, 16, 13, 0, 0),
          category: nil,
        ),
      ]

      result = described_class.call(pay_period, [employee.id], collector: stub_collector(intervals))
      shift_ot = result[employee.id.to_s][:shift_ot_hours]

      expect(result[employee.id.to_s][:ot_hours]).to eq(4.0)
      expect(shift_ot["mon"]).to eq(0.0)
      expect(shift_ot["tue"]).to eq(0.0)
      expect(shift_ot["wed"]).to eq(0.0)
      expect(shift_ot["thu"]).to eq(0.0)
      expect(shift_ot["fri"]).to eq(0.0)
      expect(shift_ot["sat"]).to eq(4.0)
    end

    it "counts daily OT once and does not also count those hours as weekly OT" do
      pay_period = pay_period_for(Date.new(2024, 3, 11))
      employee = create(:employee)
      monday = Payroll::WorkInterval.new(
        id: "mon",
        employee_id: employee.id,
        starts_at: Time.zone.local(2024, 3, 11, 9, 0, 0),
        ends_at: Time.zone.local(2024, 3, 11, 20, 0, 0),
        category: nil,
      )
      rest = (1..4).map do |day_offset|
        date = Date.new(2024, 3, 11) + day_offset
        Payroll::WorkInterval.new(
          id: "day-#{day_offset}",
          employee_id: employee.id,
          starts_at: Time.zone.local(date.year, date.month, date.day, 9, 0, 0),
          ends_at: Time.zone.local(date.year, date.month, date.day, 17, 0, 0),
          category: nil,
        )
      end

      result = described_class.call(pay_period, [employee.id], collector: stub_collector([monday, *rest]))
      hours = result[employee.id.to_s]
      shift_ot = hours[:shift_ot_hours]

      expect(hours[:ot_hours]).to eq(3.0)
      expect(hours[:regular_hours]).to eq(40.0)
      expect(shift_ot["mon"]).to eq(3.0)
      expect(shift_ot["day-1"]).to eq(0.0)
      expect(shift_ot["day-2"]).to eq(0.0)
      expect(shift_ot["day-3"]).to eq(0.0)
      expect(shift_ot["day-4"]).to eq(0.0)
    end

    it "attributes daily and weekly OT on the same long day without double-counting hours" do
      pay_period = pay_period_for(Date.new(2024, 3, 11))
      employee = create(:employee)
      intervals = (0..4).map do |day_offset|
        date = Date.new(2024, 3, 11) + day_offset
        Payroll::WorkInterval.new(
          id: "day-#{day_offset}",
          employee_id: employee.id,
          starts_at: Time.zone.local(date.year, date.month, date.day, 9, 0, 0),
          ends_at: Time.zone.local(date.year, date.month, date.day, 17, 0, 0),
          category: nil,
        )
      end
      saturday = Payroll::WorkInterval.new(
        id: "sat",
        employee_id: employee.id,
        starts_at: Time.zone.local(2024, 3, 16, 9, 0, 0),
        ends_at: Time.zone.local(2024, 3, 16, 19, 0, 0),
        category: nil,
      )

      result = described_class.call(pay_period, [employee.id], collector: stub_collector([*intervals, saturday]))
      hours = result[employee.id.to_s]

      expect(hours[:ot_hours]).to eq(10.0)
      expect(hours[:regular_hours]).to eq(40.0)
      expect(hours[:shift_ot_hours]["sat"]).to eq(10.0)
      expect(hours[:shift_ot_hours].values.sum).to eq(10.0)
    end

    it "excludes active overtime exemption matches from OT through the engine" do
      pay_period = pay_period_for(Date.new(2024, 3, 15))
      employee = create(:employee)
      service_type = create(:service_type, name: "Sleep Shift", slug: "sleep-shift")
      create(
        :overtime_exemption,
        name: "Sleep exempt",
        active: true,
        criteria: [{ "category" => { "operator" => "equals", "value" => service_type.slug } }],
      )
      interval = Payroll::WorkInterval.new(
        id: SecureRandom.uuid,
        employee_id: employee.id,
        starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0),
        ends_at: Time.zone.local(2024, 3, 15, 21, 0, 0),
        category: service_type,
      )

      result = described_class.call(pay_period, [employee.id], collector: stub_collector([interval]))

      expect(result[employee.id.to_s][:ot_hours]).to eq(0.0)
      expect(result[employee.id.to_s][:regular_hours]).to eq(12.0)
      expect(result[employee.id.to_s][:company_hours]).to eq(12.0)
    end

    it "ignores inactive overtime exemptions" do
      pay_period = pay_period_for(Date.new(2024, 3, 15))
      employee = create(:employee)
      service_type = create(:service_type, name: "Sleep Shift", slug: "sleep-shift")
      create(
        :overtime_exemption,
        name: "Sleep inactive",
        active: false,
        criteria: [{ "category" => { "operator" => "equals", "value" => service_type.slug } }],
      )
      interval = Payroll::WorkInterval.new(
        id: SecureRandom.uuid,
        employee_id: employee.id,
        starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0),
        ends_at: Time.zone.local(2024, 3, 15, 19, 0, 0),
        category: service_type,
      )

      result = described_class.call(pay_period, [employee.id], collector: stub_collector([interval]))

      expect(result[employee.id.to_s][:ot_hours]).to eq(2.0)
    end

    it "isolates hours for multiple employees in one call" do
      pay_period = pay_period_for(Date.new(2024, 3, 15))
      first = create(:employee)
      second = create(:employee)
      intervals = [
        Payroll::WorkInterval.new(
          id: SecureRandom.uuid,
          employee_id: first.id,
          starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0),
          ends_at: Time.zone.local(2024, 3, 15, 19, 0, 0),
          category: nil,
        ),
        Payroll::WorkInterval.new(
          id: SecureRandom.uuid,
          employee_id: second.id,
          starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0),
          ends_at: Time.zone.local(2024, 3, 15, 17, 0, 0),
          category: nil,
        ),
      ]

      result = described_class.call(pay_period, [first.id, second.id], collector: stub_collector(intervals))

      expect(result[first.id.to_s][:ot_hours]).to eq(2.0)
      expect(result[second.id.to_s][:ot_hours]).to eq(0.0)
    end

    it "honors non-default daily and weekly thresholds" do
      Setting.overtime_daily_hours = 10
      Setting.overtime_weekly_hours = 45
      pay_period = pay_period_for(Date.new(2024, 3, 15))
      employee = create(:employee)
      interval = Payroll::WorkInterval.new(
        id: SecureRandom.uuid,
        employee_id: employee.id,
        starts_at: Time.zone.local(2024, 3, 15, 8, 0, 0),
        ends_at: Time.zone.local(2024, 3, 15, 20, 0, 0),
        category: nil,
      )

      result = described_class.call(pay_period, [employee.id], collector: stub_collector([interval]))

      expect(result[employee.id.to_s][:regular_hours]).to eq(10.0)
      expect(result[employee.id.to_s][:ot_hours]).to eq(2.0)
    end

    context "with IHSS classification and co-employer settings" do
      before do
        Setting.ihss_assignment_mode = "shift"
      end

      it "returns 0 agency OT when co-employer is off and company hours stay under thresholds" do
        Setting.ihss_co_employer = false
        pay_period = pay_period_for(Date.new(2024, 3, 11))
        employee = create(:employee)
        intervals = [
          work_interval(employee, Date.new(2024, 3, 11), 9, 17, ihss: true),
          work_interval(employee, Date.new(2024, 3, 12), 9, 17, ihss: true),
          work_interval(employee, Date.new(2024, 3, 13), 9, 17, ihss: true),
          work_interval(employee, Date.new(2024, 3, 14), 9, 15, ihss: true),
          work_interval(employee, Date.new(2024, 3, 15), 9, 14, ihss: false),
        ]

        result = described_class.call(pay_period, [employee.id], collector: stub_collector(intervals))
        hours = result[employee.id.to_s]

        expect(hours[:ihss_hours]).to eq(30.0)
        expect(hours[:company_hours]).to eq(5.0)
        expect(hours[:ot_hours]).to eq(0.0)
        expect(hours[:regular_hours]).to eq(5.0)
      end

      it "calculates daily OT from company hours only when co-employer is off" do
        Setting.ihss_co_employer = false
        pay_period = pay_period_for(Date.new(2024, 3, 15))
        employee = create(:employee)
        intervals = [
          work_interval(employee, Date.new(2024, 3, 15), 6, 12, ihss: true),
          work_interval(employee, Date.new(2024, 3, 15), 12, 22, ihss: false),
        ]

        result = described_class.call(pay_period, [employee.id], collector: stub_collector(intervals))
        hours = result[employee.id.to_s]

        expect(hours[:ihss_hours]).to eq(6.0)
        expect(hours[:company_hours]).to eq(10.0)
        expect(hours[:ot_hours]).to eq(2.0)
        expect(hours[:regular_hours]).to eq(8.0)
      end

      it "returns 0 agency OT for IHSS-only hours over the daily threshold when co-employer is off" do
        Setting.ihss_co_employer = false
        pay_period = pay_period_for(Date.new(2024, 3, 15))
        employee = create(:employee)
        intervals = [work_interval(employee, Date.new(2024, 3, 15), 8, 18, ihss: true)]

        result = described_class.call(pay_period, [employee.id], collector: stub_collector(intervals))
        hours = result[employee.id.to_s]

        expect(hours[:ihss_hours]).to eq(10.0)
        expect(hours[:company_hours]).to eq(0.0)
        expect(hours[:ot_hours]).to eq(0.0)
        expect(hours[:regular_hours]).to eq(0.0)
      end

      it "counts all hours toward weekly OT when co-employer is on" do
        Setting.ihss_co_employer = true
        pay_period = pay_period_for(Date.new(2024, 3, 11))
        employee = create(:employee)
        intervals = [
          work_interval(employee, Date.new(2024, 3, 11), 9, 16, ihss: true),
          work_interval(employee, Date.new(2024, 3, 12), 9, 16, ihss: true),
          work_interval(employee, Date.new(2024, 3, 13), 9, 16, ihss: true),
          work_interval(employee, Date.new(2024, 3, 14), 9, 16, ihss: true),
          work_interval(employee, Date.new(2024, 3, 15), 9, 16, ihss: true),
          work_interval(employee, Date.new(2024, 3, 16), 9, 17, ihss: false),
          work_interval(employee, Date.new(2024, 3, 17), 9, 11, ihss: false),
        ]

        result = described_class.call(pay_period, [employee.id], collector: stub_collector(intervals))
        hours = result[employee.id.to_s]

        expect(hours[:ihss_hours]).to eq(35.0)
        expect(hours[:company_hours]).to eq(10.0)
        expect(hours[:ot_hours]).to eq(5.0)
        expect(hours[:regular_hours]).to eq(40.0)
      end

      it "ignores IHSS hours for weekly OT when co-employer is off with the same mix" do
        Setting.ihss_co_employer = false
        pay_period = pay_period_for(Date.new(2024, 3, 11))
        employee = create(:employee)
        intervals = [
          work_interval(employee, Date.new(2024, 3, 11), 9, 16, ihss: true),
          work_interval(employee, Date.new(2024, 3, 12), 9, 16, ihss: true),
          work_interval(employee, Date.new(2024, 3, 13), 9, 16, ihss: true),
          work_interval(employee, Date.new(2024, 3, 14), 9, 16, ihss: true),
          work_interval(employee, Date.new(2024, 3, 15), 9, 16, ihss: true),
          work_interval(employee, Date.new(2024, 3, 16), 9, 17, ihss: false),
          work_interval(employee, Date.new(2024, 3, 17), 9, 11, ihss: false),
        ]

        result = described_class.call(pay_period, [employee.id], collector: stub_collector(intervals))
        hours = result[employee.id.to_s]

        expect(hours[:ihss_hours]).to eq(35.0)
        expect(hours[:company_hours]).to eq(10.0)
        expect(hours[:ot_hours]).to eq(0.0)
        expect(hours[:regular_hours]).to eq(10.0)
      end

      it "includes IHSS hours in daily OT when co-employer is on" do
        Setting.ihss_co_employer = true
        pay_period = pay_period_for(Date.new(2024, 3, 15))
        employee = create(:employee)
        intervals = [
          work_interval(employee, Date.new(2024, 3, 15), 6, 12, ihss: true),
          work_interval(employee, Date.new(2024, 3, 15), 12, 18, ihss: false),
        ]

        result = described_class.call(pay_period, [employee.id], collector: stub_collector(intervals))
        hours = result[employee.id.to_s]

        expect(hours[:ihss_hours]).to eq(6.0)
        expect(hours[:company_hours]).to eq(6.0)
        expect(hours[:ot_hours]).to eq(4.0)
        expect(hours[:regular_hours]).to eq(8.0)
      end

      it "keeps classification totals when an exempt interval is removed from OT" do
        Setting.ihss_co_employer = true
        pay_period = pay_period_for(Date.new(2024, 3, 15))
        employee = create(:employee)
        service_type = create(:service_type, name: "Sleep Shift", slug: "sleep-shift")
        create(
          :overtime_exemption,
          name: "Sleep with IHSS",
          active: true,
          criteria: [{ "category" => { "operator" => "equals", "value" => service_type.slug } }],
        )
        intervals = [
          Payroll::WorkInterval.new(
            id: SecureRandom.uuid,
            employee_id: employee.id,
            starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0),
            ends_at: Time.zone.local(2024, 3, 15, 21, 0, 0),
            category: service_type,
            ihss: true,
          ),
        ]

        result = described_class.call(pay_period, [employee.id], collector: stub_collector(intervals))
        hours = result[employee.id.to_s]

        expect(hours[:ihss_hours]).to eq(12.0)
        expect(hours[:company_hours]).to eq(0.0)
        expect(hours[:ot_hours]).to eq(0.0)
      end
    end

    it "counts recurring shift occurrences that fall in the pay period" do
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:semi_monthly]
      pay_period = PayPeriod.for_period_dates(Date.new(2026, 11, 16), Date.new(2026, 11, 30))
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
      create(:shift, employee:, calendar_event: master)

      result = described_class.call(pay_period, [employee.id])

      expect(result[employee.id.to_s][:regular_hours]).to eq(24.0)
      expect(result[employee.id.to_s][:company_hours]).to eq(24.0)
      expect(result[employee.id.to_s][:ot_hours]).to eq(0.0)
    end
  end

  def stub_collector(intervals)
    Class.new(Payroll::WorkIntervalCollector) do
      def initialize(rows)
        @intervals = rows
      end

      def intervals_for(pay_period:, employee_ids:, range_start: nil, range_end: nil) # rubocop:disable Lint/UnusedMethodArgument
        @intervals.select { |work_interval| employee_ids.include?(work_interval.employee_id) }
      end
    end.new(intervals)
  end

  def work_interval(employee, date, start_hour, end_hour, ihss:)
    Payroll::WorkInterval.new(
      id: SecureRandom.uuid,
      employee_id: employee.id,
      starts_at: Time.zone.local(date.year, date.month, date.day, start_hour, 0, 0),
      ends_at: Time.zone.local(date.year, date.month, date.day, end_hour, 0, 0),
      category: nil,
      ihss: ihss,
    )
  end
end
