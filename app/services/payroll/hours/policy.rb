# frozen_string_literal: true

module Payroll
  module Hours
    module Policy
      def self.for(name)
        case name.to_s
        when Employee::OVERTIME_POLICIES[:personal_attendant]
          PersonalAttendant.new
        else
          Standard.new
        end
      end
    end
  end
end
