class Prescriptions::IndexSerializer < PrescriptionSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
