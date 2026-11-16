class Employee::Departments::PersistedSerializer < Employee::DepartmentSerializer
  include Persisted

  attributes(
    :slug,
  )
end
