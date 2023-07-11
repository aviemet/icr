class Shifts::CalendarSerializer < ApplicationSerializer
  object_as :shift

  attributes(
    :starts_at,
    :ends_at,
    :title,
    :employee_id,
    :created_at,
    :updated_at,
  )

  belongs_to :employee, serializer: Employees::CalendarSerializer
  belongs_to :recurring_pattern, serializer: RecurringPatterns::FormDataSerializer
  belongs_to :parent, serializer: ShiftSerializer
end
