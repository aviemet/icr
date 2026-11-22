class IncidentReports::ShowSerializer < IncidentReports::PersistedSerializer
  has_many :hospital_visits, serializer: Client::HospitalVisits::PersistedSerializer
  belongs_to :doctor, serializer: Doctors::PersistedSerializer
  belongs_to :client, serializer: Clients::PersistedSerializer
end
