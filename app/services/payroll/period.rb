module Payroll
  class Period
    class << self
      # Returns the start and end dates of the pay period containing the given date
      # @param reference_date [Date] The date to find the pay period for
      # @return [Array<Date>] An array containing [start_date, end_date]
      def period_dates(reference_date = Date.current)
        case Setting.payroll_period_type
        when Setting::PAY_PERIOD_TYPES[:weekly]
          weekly_period_dates(reference_date)
        when Setting::PAY_PERIOD_TYPES[:bi_weekly]
          bi_weekly_period_dates(reference_date)
        when Setting::PAY_PERIOD_TYPES[:semi_monthly]
          semi_monthly_period_dates(reference_date)
        when Setting::PAY_PERIOD_TYPES[:monthly]
          monthly_period_dates(reference_date)
        end
      end

      # Returns the start and end dates of the previous pay period
      # @param reference_date [Date] The reference date (defaults to current date)
      # @return [Array<Date>] An array containing [start_date, end_date]
      def previous_period_dates(reference_date = Date.current)
        start_date, = period_dates(reference_date)
        period_dates(start_date - 1.day)
      end

      # Returns the start and end dates of the next pay period
      # @param reference_date [Date] The reference date (defaults to current date)
      # @return [Array<Date>] An array containing [start_date, end_date]
      def next_period_dates(reference_date = Date.current)
        _, end_date = period_dates(reference_date)
        period_dates(end_date + 1.day)
      end

      def payroll_due_date(period_end_date)
        case Setting.payroll_due_date_rule_type
        when Setting::PAYROLL_DUE_DATE_RULE_TYPES[:days_after_period_end]
          period_end_date + Setting.payroll_due_date_days.days
        when Setting::PAYROLL_DUE_DATE_RULE_TYPES[:day_of_week_after_period_end]
          target_wday = %w[sunday monday tuesday wednesday thursday friday saturday].index(Setting.payroll_due_date_day_of_week)
          cursor = period_end_date + 1.day
          cursor += 1.day until cursor.wday == target_wday
          cursor
        when Setting::PAYROLL_DUE_DATE_RULE_TYPES[:day_of_month]
          day_str = Setting.payroll_due_date_day_of_month
          due_month = period_end_date + 1.day
          if day_str == "-1"
            due_month.end_of_month
          else
            day = day_str.to_i
            due_month.change(day: [day, due_month.end_of_month.day].min)
          end
        else
          period_end_date + 5.days
        end
      end

      def approval_window_opens_at(period_end_date)
        period_end_date + 1.day
      end

      def approval_window_closes_at(period_end_date)
        payroll_due_date(period_end_date)
      end

      def approval_window_open?(period_end_date)
        today = Date.current
        return false if today <= period_end_date

        today <= approval_window_closes_at(period_end_date)
      end

      private

      def weekly_period_dates(date)
        start_day = Setting.payroll_period_day.to_sym
        start_date = date.beginning_of_week(start_day)
        end_date = start_date + 6.days
        [start_date, end_date]
      end

      def bi_weekly_period_dates(date)
        start_day = Setting.payroll_period_day.to_sym
        reference_start = Date.new(2024, 1, 3).beginning_of_week(start_day)

        # Find the current week start
        current_week_start = date.beginning_of_week(start_day)

        # Calculate weeks since reference
        weeks_since_reference = ((current_week_start - reference_start).to_i / 7.0).floor

        # Find the period start by going back to the nearest even week boundary
        period_start = reference_start + (weeks_since_reference - (weeks_since_reference % 2)).weeks

        # If we're past the middle of the period, move to the next period
        if (date - period_start).to_i >= 14
          period_start += 2.weeks
        end

        [period_start, period_start + 13.days]
      end

      def semi_monthly_period_dates(date)
        first_date = Setting.payroll_period_date.to_i
        second_date = Setting.payroll_period_date_2.to_i

        # For last day of month setting, we need to determine if we're in the first or second half
        if second_date == -1
          if date.day >= 15
            # Second half of the month
            [date.change(day: 15), date.end_of_month]
          elsif date.day >= first_date
            # First half of the month
            [date.change(day: first_date), date.change(day: 14)]
          else
            # Last period of previous month
            prev_month = date.prev_month
            [prev_month.change(day: 15), prev_month.end_of_month]
          end
        elsif date.day >= second_date
          # Regular semi-monthly periods
          # Last period of the month
          [date.change(day: second_date), date.end_of_month]
        elsif date.day >= first_date
            # Middle period
          [date.change(day: first_date), date.change(day: second_date - 1)]
        else
            # First period (started in previous month)
          prev_month = date.prev_month
          [prev_month.change(day: second_date), date.change(day: first_date - 1)]
        end
      end

      def monthly_period_dates(date)
        period_date = Setting.payroll_period_date.to_i

        if period_date == -1
          # Last day of month periods
          if date.day == date.end_of_month.day
            # We're on the last day, start of new period
            next_month = date + 1.month
            [date, next_month.end_of_month - 1.day]
          else
            # Find the previous month end
            prev_month_end = date.prev_month.end_of_month
            [prev_month_end, date.end_of_month - 1.day]
          end
        elsif date.day >= period_date
          # Regular monthly periods
          next_month = date + 1.month
          end_date = if period_date == 1
                       date.end_of_month
                     else
                       next_month.prev_day(next_month.day - (period_date - 1))
                     end
          [date.change(day: period_date), end_date]
            # Current period
        else
            # Previous period
          prev_month = date - 1.month
          end_date = if period_date == 1
                       prev_month.end_of_month
                     else
                       date.prev_day(date.day - (period_date - 1))
                     end
          [prev_month.change(day: period_date), end_date]
        end
      end
    end
  end
end
