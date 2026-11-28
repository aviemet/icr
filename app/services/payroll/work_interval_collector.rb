# frozen_string_literal: true

module Payroll
  class WorkIntervalCollector
    def intervals_for(pay_period:, employee_ids:, range_start: nil, range_end: nil)
      raise NotImplementedError
    end
  end
end
