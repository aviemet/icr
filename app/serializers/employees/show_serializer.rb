class Employees::ShowSerializer < Employees::PersistedSerializer
  has_one :person, serializer: People::ShowSerializer
  has_one :primary_manager, serializer: Employees::PersistedSerializer

  has_many :support_contacts, serializer: Employee::SupportContacts::PersistedSerializer
  has_many :credentials, serializer: Employee::Credentials::PersistedSerializer
  has_many :clearances, serializer: Employee::Clearances::PersistedSerializer
  has_many :identifications, serializer: Identifications::ShowSerializer
  has_many :pay_rates, serializer: Employee::PayRates::PersistedSerializer
  has_many :managers_employees_managers, serializer: Employee::EmployeesManagers::PersistedSerializer
  has_many :clients_attendants, serializer: ClientsAttendants::PersistedSerializer
  has_many :clients_managers, serializer: ClientsManagers::PersistedSerializer
  has_many :employees_trainings, serializer: Employee::EmployeesTrainings::PersistedSerializer
  has_many :interviews, serializer: Employee::Interviews::PersistedSerializer
  has_many :offers, serializer: Employee::Offers::PersistedSerializer
  has_many :attended_clients, serializer: Clients::PersistedSerializer
  has_many :managed_clients, serializer: Clients::PersistedSerializer
  has_many :documents, serializer: Attachments::FileSerializer
  has_many :images, serializer: Attachments::FileSerializer

  type :number, optional: false
  def assigned_clients_count
    @object.attended_clients.size + @object.managed_clients.size
  end

  type :number, optional: false
  def incomplete_trainings_count
    @object.employees_trainings.count { |row| row.completed_at.blank? }
  end

  type :number, optional: false
  def expiring_credentials_count
    @object.credentials.count(&:expiring_soon?)
  end

  type :number, optional: false
  def expiring_clearances_count
    @object.clearances.count(&:expiring_soon?)
  end

  type :number, optional: false
  def emergency_contacts_count
    @object.support_contacts.count(&:is_emergency)
  end

  type :string, optional: true
  def current_pay_period_id
    current_pay_period&.id
  end

  type :string, optional: true
  def current_pay_period_slug
    current_pay_period&.slug
  end

  type :Date, optional: true
  delegate :pending_termination_at, to: :@object

  private

  def current_pay_period
    memo.fetch(:current_pay_period) do
      period_start_date, = Payroll::Period.period_dates
      PayPeriod.where(starts_at: period_start_date.to_time.beginning_of_day.all_day)
        .order(:created_at, :starts_at)
        .first
    end
  end
end
