class ShiftTemplateApplicator
  class << self
    def apply(shift_template, start_date)
      return false unless shift_template && start_date
      return false if shift_template.check_conflicts.any?

      ApplicationRecord.transaction do
        create_shifts_for_week(shift_template, start_date)
      end

      true
    rescue ActiveRecord::RecordInvalid
      false
    end

    def apply_recurring(shift_template)
      return false unless shift_template.recurring? && shift_template.active?

      current_date = shift_template.start_date

      while current_date <= shift_template.end_date
        apply(shift_template, current_date)
        current_date = next_application_date(current_date, shift_template.frequency)
      end

      true
    end

    private

    def create_shifts_for_week(shift_template, start_date)
      week_start = start_date.beginning_of_week

      shift_template.shift_template_entries.each do |template_entry|
        shift_date = week_start + template_entry.day_of_week.days

        event = Calendar::Event.create!(
          start_time: shift_date.change(
            hour: template_entry.start_time.hour,
            min: template_entry.start_time.min,
          ),
          end_time: shift_date.change(
            hour: template_entry.end_time.hour,
            min: template_entry.end_time.min,
          ),
          client_id: shift_template.client_id,
        )

        Shift.create!(
          calendar_event: event,
          employee: template_entry.employee,
        )
      end
    end

    def next_application_date(current_date, frequency)
      case frequency.to_sym
      when :weekly
        current_date + 1.week
      when :biweekly
        current_date + 2.weeks
      when :monthly
        current_date + 1.month
      end
    end
  end
end
