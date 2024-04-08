class Employees::EditSerializer < EmployeeSerializer

  attributes(
    :slug,
    :id,
    :updated_at,
    :created_at,
  )
end
