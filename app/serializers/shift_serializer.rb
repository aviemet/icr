class ShiftSerializer < ApplicationSerializer
  object_as :shift

  attributes(
    :starts_at,
    :ends_at,
    :created_at,
    :updated_at,
  )

  attribute :title do
    "#{shift.starts_at.strftime('%-I %p')} - #{shift.employee.person.first_name}"
  end

  belongs_to :employee, serializer: EmployeeSerializer
  belongs_to :created_by, serializer: UserSerializer
  belongs_to :parent, serializer: ShiftSerializer
end
