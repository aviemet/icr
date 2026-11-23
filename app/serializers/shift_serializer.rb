# == Schema Information
#
# Table name: shifts
#
#  id                      :uuid             not null, primary key
#  facilitator_approved_at :date
#  ihss                    :boolean          default(FALSE), not null
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  calendar_event_id       :uuid             not null
#  category_id             :uuid
#  employee_id             :uuid
#  service_type_id         :uuid             not null
#  timesheet_id            :uuid
#
# Indexes
#
#  index_shifts_on_calendar_event_id  (calendar_event_id) UNIQUE
#  index_shifts_on_category_id        (category_id)
#  index_shifts_on_employee_id        (employee_id)
#  index_shifts_on_service_type_id    (service_type_id)
#  index_shifts_on_timesheet_id       (timesheet_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_event_id => calendar_events.id)
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (service_type_id => service_types.id)
#  fk_rails_...  (timesheet_id => timesheets.id)
#
class ShiftSerializer < ApplicationSerializer
  object_as :shift, model: "Shift"

  attributes(
    :employee_id,
    :calendar_event_id,
    :service_type_id,
  )

  belongs_to :service_type, serializer: ServiceTypeSerializer
end
