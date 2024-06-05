# == Schema Information
#
# Table name: shifts
#
#  id                :bigint           not null, primary key
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_event_id :bigint           not null
#  employee_id       :bigint           not null
#
# Indexes
#
#  index_shifts_on_calendar_event_id  (calendar_event_id)
#  index_shifts_on_employee_id        (employee_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_event_id => calendar_events.id)
#  fk_rails_...  (employee_id => employees.id)
#
class ShiftSerializer < ApplicationSerializer
  object_as :shift

  attributes(
    :employee_id,
  )

  belongs_to :employee, serializer: EmployeeSerializer
  has_many :clients, serializer: ClientSerializer
  has_many :households, serializer: HouseholdSerializer
end
