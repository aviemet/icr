class Doctors::ShowSerializer < DoctorSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
