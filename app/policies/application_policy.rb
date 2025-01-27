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
  end

  def initialize(user, record)
    @user = user
    @record = record
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

  private

  def standard_auth(action)
    return true if user.has_role?(:super_admin) || user.has_role?(:admin)

    case user.person&.role_type
    when "Employee"
      check_employee_permissions(action)
    when "Client"
      check_client_permissions(action)
    when "Doctor"
      check_doctor_permissions(action)
    when "Vendor"
      check_vendor_permissions(action)
    else
      false
    end
  end

  def check_employee_permissions(action)
    # Check job title specific roles
    return true if user.person.employee.job_title &&
      user.has_role?(action, user.person.employee.job_title)

    # Check general employee roles
    user.has_role?(action, :employee)
  end

  def check_client_permissions(action)
    user.has_role?(action, :client)
  end

  def check_doctor_permissions(action)
    user.has_role?(action, :doctor)
  end

  def check_vendor_permissions(action)
    user.has_role?(action, :vendor)
  end
end
