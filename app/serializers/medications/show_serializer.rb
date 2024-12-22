class Medications::ShowSerializer < MedicationSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
