class Client::Enrollments::PersistedSerializer < Client::EnrollmentSerializer
  include Persisted

  belongs_to :vendor, serializer: Vendors::PersistedSerializer
end
