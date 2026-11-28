# frozen_string_literal: true

module Payroll
  class EmployeePeriodHours
    def self.call(pay_period, employee_ids, collector: WorkIntervalCollectors::ScheduledShifts.new)
      Hours::Engine.call(pay_period, employee_ids, collector: collector)
    end
  end
end
