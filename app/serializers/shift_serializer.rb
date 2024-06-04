# == Schema Information
#
# Table name: shifts
#
#  id          :bigint           not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  employee_id :bigint           not null
#
# Indexes
#
#  index_shifts_on_employee_id  (employee_id)
#
# Foreign Keys
#
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
