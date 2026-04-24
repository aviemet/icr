module Payroll
  class WorkIntervalCollector
    def intervals_for(pay_period:, employee_ids:)
      raise NotImplementedError
    end
  end
end
