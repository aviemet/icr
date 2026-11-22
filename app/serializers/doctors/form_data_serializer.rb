class Doctors::FormDataSerializer < DoctorSerializer
  has_one :person, serializer: People::FormDataSerializer
end
