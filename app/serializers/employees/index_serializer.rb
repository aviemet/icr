class Employees::IndexSerializer < EmployeeSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
