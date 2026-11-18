class ApplicationPolicy
  attr_reader :user, :record

  class Scope
    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      raise NotImplementedError, "You must define #resolve in #{self.class}"
    end

    private

    attr_reader :user, :scope

    def admin?
      user&.has_role?(:admin) || false
    end

    def employee
      user&.person&.employee
    end

    def job_title
      employee&.job_title
    end

    def job_title_allows?(action, resource_class)
      job_title&.has_role?(action, resource_class) || false
    end
  end

  def initialize(user, record)
    @user = user
    @record = record
    @person = @user.person
    @employee = @person&.employee
    @job_title = @employee&.job_title
    @client = @person&.client
  end

  def index?
    standard_auth(:index)
  end

  def show?
    standard_auth(:show)
  end

  def create?
    standard_auth(:create)
  end

  def new?
    create?
  end

  def update?
    standard_auth(:update)
  end

  def edit?
    update?
  end

  def destroy?
    standard_auth(:destroy)
  end

  def policy_methods
    policy_methods = self.class.public_instance_methods - Object.public_instance_methods
    policy_methods.select { |m| m.to_s.end_with?("?") }
  end

  protected

  def admin?
    return @admin if defined?(@admin)

    @admin = user&.has_role?(:admin) || false
  end

  def client?
    user.person&.client&.active?
  end

  def employee?
    user.person&.employee&.active?
  end

  def job_title_allows?(action, resource_class = resource_class_for_record)
    @job_title&.has_role?(action, resource_class) || false
  end

  def current_employee
    @employee
  end

  def current_attendant?(client_record = record)
    return false unless current_employee
    return false unless client_record.is_a?(Client)

    client_record.clients_attendants.current.exists?(attendant: current_employee)
  end

  def manages_client?(client_record = record)
    return false unless current_employee
    return false unless client_record.is_a?(Client)

    client_record.clients_managers.current.exists?(manager: current_employee)
  end

  def manages_employee?(employee_record = record)
    return false unless current_employee
    return false unless employee_record.is_a?(Employee)

    current_employee.managed_employees_managers.current.exists?(employee: employee_record)
  end

  def resource_class_for_record
    record.is_a?(Class) ? record : record.class
  end

  private

  def standard_auth(action)
    return true if admin?

    job_title_allows?(action, resource_class_for_record)
  end
end
