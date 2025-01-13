class CreateShiftsFromTemplateJob < ApplicationJob
  queue_as :default

  def perform(shift_template_id, start_date)
    shift_template = ShiftTemplate.find_by(id: shift_template_id)
    return unless shift_template&.active?

    ShiftTemplateApplicator.apply(shift_template, start_date)
  end
end
