# frozen_string_literal: true

module Payroll
  module Hours
    module Policy
      class PersonalAttendant
        def daily_ot_after
          Setting.overtime_personal_attendant_daily_hours.to_f
        end

        def daily_double_time_after
          Float::INFINITY
        end

        def seventh_day_double_time_after
          Float::INFINITY
        end

        def weekly_ot_after
          Setting.overtime_personal_attendant_weekly_hours.to_f
        end

        def seventh_day_premiums?
          false
        end

        def double_time?
          false
        end
      end
    end
  end
end
