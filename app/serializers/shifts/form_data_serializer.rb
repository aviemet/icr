class Shifts::FormDataSerializer < ApplicationSerializer
  object_as :shift

  attributes(
    :starts_at,
    :ends_at,
    :title,
    :employee_id,
    :created_at,
    :updated_at,
  )

  belongs_to :clients, serializer: ClientSerializer
  belongs_to :employee, serializer: EmployeeSerializer
  belongs_to :created_by, serializer: UserSerializer
  belongs_to :parent, serializer: ShiftSerializer
end
