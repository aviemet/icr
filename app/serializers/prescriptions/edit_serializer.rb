class Prescriptions::EditSerializer < PrescriptionSerializer

  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
