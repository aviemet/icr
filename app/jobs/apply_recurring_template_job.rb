class ApplyRecurringTemplateJob < ApplicationJob
  queue_as :default

  def perform(shift_template_id)
    shift_template = ShiftTemplate.find_by(id: shift_template_id)
    return unless shift_template&.active? && shift_template.recurring?

    ShiftTemplateApplicator.apply_recurring(shift_template)
  end
end
