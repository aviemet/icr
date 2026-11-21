class Clients::ShowSerializer < Clients::PersistedSerializer
  has_one :person, serializer: People::ShowSerializer
  has_one :household, serializer: Households::PersistedSerializer
  has_one :life_detail, serializer: Client::LifeDetails::PersistedSerializer
  has_one :current_manager, serializer: Employees::PersistedSerializer

  has_many :current_attendants, serializer: Employees::PersistedSerializer
  has_many :doctors, serializer: Doctors::PersistedSerializer
  has_many :support_contacts, serializer: Client::SupportContacts::PersistedSerializer
  has_many :allergies, serializer: Client::Allergies::PersistedSerializer
  has_many :diagnoses, serializer: Client::Diagnoses::PersistedSerializer
  has_many :enrollments, serializer: Client::Enrollments::PersistedSerializer
  has_many :prescriptions, serializer: Prescriptions::PersistedSerializer
  has_many :clients_managers, serializer: ClientsManagers::PersistedSerializer
  has_many :clients_attendants, serializer: ClientsAttendants::PersistedSerializer
  has_many :incident_reports, serializer: IncidentReports::PersistedSerializer
  has_many :clients_trainings, serializer: ClientsTrainings::ShowRowSerializer

  type "Array<{ id: string, filename: string, content_type: string, byte_size: number, url: string, created_at: Date }>"
  def documents
    Attachments::FileSerializer.many(@object.documents)
  end

  type "Array<{ id: string, filename: string, content_type: string, byte_size: number, url: string, created_at: Date }>"
  def images
    Attachments::FileSerializer.many(@object.images)
  end

  type :number, optional: false
  def active_allergies_count
    @object.allergies.count(&:active?)
  end

  type :number, optional: false
  def active_prescriptions_count
    active_prescription_records.size
  end

  type :number, optional: false
  def incident_reports_count
    @object.incident_reports.size
  end

  type :number, optional: false
  def emergency_contacts_count
    @object.support_contacts.count(&:is_emergency)
  end

  private

  def active_prescription_records
    @object.prescriptions.select { |prescription|
      starts = prescription.starts_at
      ends = prescription.ends_at
      (starts.nil? || starts <= Date.current) && (ends.nil? || ends >= Date.current)
    }
  end
end
