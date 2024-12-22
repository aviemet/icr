class Doctors::IndexSerializer < DoctorSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
