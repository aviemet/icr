class Calendar::Events::ShowSerializer < Calendar::EventSerializer
  belongs_to :employee, serializer: Employees::PersistedSerializer
end
