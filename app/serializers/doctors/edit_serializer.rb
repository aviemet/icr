class Doctors::EditSerializer < DoctorSerializer

  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
