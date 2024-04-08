class Employees::IndexSerializer < EmployeeSerializer
  attributes(
    :slug,
    :id,
    :updated_at,
    :created_at,
  )
end
