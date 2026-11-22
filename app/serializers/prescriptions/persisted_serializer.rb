class Prescriptions::PersistedSerializer < PrescriptionSerializer
  include Persisted

  belongs_to :medication, serializer: MedicationSerializer
  belongs_to :dosage, serializer: DosageSerializer
  belongs_to :doctor, serializer: Doctors::PersistedSerializer
  belongs_to :client, serializer: Clients::PersistedSerializer
end

