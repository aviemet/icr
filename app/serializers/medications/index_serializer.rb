class Medications::IndexSerializer < MedicationSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
