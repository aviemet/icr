class Client::HospitalVisits::PersistedSerializer < Client::HospitalVisitSerializer
  include Persisted

  belongs_to :client, serializer: Clients::PersistedSerializer
  belongs_to :doctor, serializer: Doctors::PersistedSerializer
  belongs_to :incident_report, serializer: IncidentReports::PersistedSerializer
end
