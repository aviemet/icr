# == Schema Information
#
# Table name: shifts
#
#  id                :uuid             not null, primary key
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_entry_id :uuid             not null
#  employee_id       :uuid             not null
#
# Indexes
#
#  index_shifts_on_calendar_entry_id  (calendar_entry_id)
#  index_shifts_on_employee_id        (employee_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_entry_id => calendar_entries.id)
#  fk_rails_...  (employee_id => employees.id)
#
class ShiftSerializer < ApplicationSerializer
  object_as :shift

  attributes(
    :employee_id,
  )

  belongs_to :calendar_entry, serializer: CalendarEntrySerializer
  belongs_to :employee, serializer: EmployeeSerializer
  has_many :clients, serializer: ClientSerializer
  has_many :households, serializer: HouseholdSerializer
end
