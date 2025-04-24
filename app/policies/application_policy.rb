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
    @person = @user.person
    @employee = @person&.employee
    @job_title = @employee&.job_title&.includes(:roles)
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

  private

  def standard_auth(action)
    return true if admin?

    permission_context = build_permission_context
    user.permission?(resource_name, action, permission_context)
  end

  def resource_name
    @resource_name ||= record.class.name.underscore.pluralize
  end

  def build_permission_context
    {
      user_id: user.id,
      record_user_id: record_owner_id
    }
  end

  def record_owner_id
    return nil unless record.respond_to?(:person_id)
    return nil unless user.person

    record.person_id == user.person.id ? user.id : nil
  end
end
