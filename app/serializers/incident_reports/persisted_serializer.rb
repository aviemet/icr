class IncidentReports::PersistedSerializer < IncidentReportSerializer
  include Persisted

  belongs_to :doctor, serializer: Doctors::PersistedSerializer
  belongs_to :client, serializer: Clients::PersistedSerializer
end
