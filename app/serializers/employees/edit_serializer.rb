class Employees::EditSerializer < EmployeeSerializer

  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
