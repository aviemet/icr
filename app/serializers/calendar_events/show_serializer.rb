class CalendarEvents::ShowSerializer < CalendarEventSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )

  class SchedulableSerializer < ApplicationSerializer
    attributes(
      :employee_id,
    )

    belongs_to :employee, serializer: EmployeeSerializer
  end

  belongs_to :schedulable, serializer: SchedulableSerializer
end
