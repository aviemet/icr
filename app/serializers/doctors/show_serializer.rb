class Doctors::ShowSerializer < Doctors::PersistedSerializer
  has_one :person, serializer: People::ShowSerializer

  has_many :clients, serializer: Clients::PersistedSerializer
  has_many :doctors_clients, serializer: DoctorsClients::PersistedSerializer
  has_many :prescriptions, serializer: Prescriptions::PersistedSerializer
  has_many :diagnoses, serializer: Client::Diagnoses::PersistedSerializer
  has_many :hospital_visits, serializer: Client::HospitalVisits::PersistedSerializer
  has_many :incident_reports, serializer: IncidentReports::PersistedSerializer

  type :number, optional: false
  def clients_count
    @object.clients.size
  end

  type :number, optional: false
  def prescriptions_count
    @object.prescriptions.size
  end

  type :number, optional: false
  def diagnoses_count
    @object.diagnoses.size
  end

  type :number, optional: false
  def hospital_visits_count
    @object.hospital_visits.size
  end
end
