class Employees::ShowSerializer < EmployeeSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
