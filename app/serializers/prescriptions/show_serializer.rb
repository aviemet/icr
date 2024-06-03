class Prescriptions::ShowSerializer < PrescriptionSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
