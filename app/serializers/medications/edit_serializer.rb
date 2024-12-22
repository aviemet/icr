class Medications::EditSerializer < MedicationSerializer

  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
