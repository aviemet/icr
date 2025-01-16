class ScheduleUpcomingShiftsJob < ApplicationJob
  queue_as :default

  def perform
    ShiftTemplate.where(active: true)
      .where.not(frequency: nil)
      .find_each do |template|

      next_period_date = case template.frequency.to_sym
                         when :weekly
                           1.week.from_now
                         when :biweekly
                           2.weeks.from_now
                         when :monthly
                           1.month.from_now
                         end.to_date

      # Skip if we're past the end date
      next if template.end_date && next_period_date > template.end_date

      CreateShiftsFromTemplateJob.perform_later(template.id, next_period_date)
    end
  end
end
