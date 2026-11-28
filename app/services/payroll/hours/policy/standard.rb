# frozen_string_literal: true

module Payroll
  module Hours
    module Policy
      class Standard
        def daily_ot_after
          Setting.overtime_daily_hours.to_f
        end

        def daily_double_time_after
          Setting.overtime_daily_double_time_hours.to_f
        end

        def seventh_day_double_time_after
          Setting.overtime_seventh_day_double_time_hours.to_f
        end

        def weekly_ot_after
          Setting.overtime_weekly_hours.to_f
        end

        def seventh_day_premiums?
          true
        end

        def double_time?
          true
        end
      end
    end
  end
end
