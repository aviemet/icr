module Payroll
  module WorkIntervalCollectors
    class ScheduledShifts < WorkIntervalCollector
      def intervals_for(pay_period:, employee_ids:)
        return [] if employee_ids.empty?

        shift_records = Shift
          .where(employee_id: employee_ids)
          .where(timesheet_id: Timesheet.where(pay_period_id: pay_period.id, employee_id: employee_ids).select(:id))
          .includes(:category, :calendar_event)

        shift_records.filter_map do |shift|
          starts_at = shift.start_time
          ends_at = shift.end_time
          next if starts_at.blank? || ends_at.blank?

          WorkInterval.new(
            employee_id: shift.employee_id,
            starts_at: starts_at,
            ends_at: ends_at,
            category: shift.category,
          )
        end
      end
    end
  end
end
