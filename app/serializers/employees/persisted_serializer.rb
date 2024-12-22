class Employees::PersistedSerializer < EmployeeSerializer
  include Persisted

  attributes(
    :slug,
  )

  has_one :person, serializer: People::PersistedSerializer
end
