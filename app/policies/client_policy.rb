class ClientPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      # Admins can see all clients
      return scope.all if user.has_role?(:admin)

      case user.person&.agency_role
      when "Employee"
        if user.person.employee&.job_title&.has_role?(:index, Client)
          scope.all
        else
          # Return clients where the employee is an attendant
          scope.joins(:clients_attendants)
            .where(clients_attendants: { attendant_id: user.person.employee.id })
            .where("clients_attendants.starts_at <= ? AND (clients_attendants.ends_at IS NULL OR clients_attendants.ends_at >= ?)", Time.current, Time.current)
            .distinct
        end
      when "Client"
        if user.roles.exists?(name: "index", resource_type: "Client", resource_id: nil)
          scope.where(id: user.person.client.id)
        else
          scope.none
        end
      else
        scope.none
      end
    end
  end

  def index?
    return true if user.has_role?(:admin)
    return false unless user.person

    case user.person.agency_role
    when "Employee"
      return true if user.person.employee&.job_title&.has_role?(:index, Client)

      user.person.employee.clients_attendants.current.exists?
    when "Client"
      user_has_client_role?(:index)
    else
      false
    end
  end

  def show?
    return true if user.has_role?(:admin)
    return false unless user.person

    case user.person.agency_role
    when "Employee"
      return true if user.person.employee&.job_title&.has_role?(:show, Client)

      current_attendant?
    when "Client"
      user_has_client_role?(:show) && record.id == user.person.client.id
    else
      false
    end
  end

  def schedule?
    return true if user.has_role?(:admin)
    return false unless user.person

    case user.person.agency_role
    when "Employee"
      return true if user.person.employee&.job_title&.has_role?(:show, Client)

      current_attendant?
    when "Client"
      user_has_client_role?(:show) && record.id == user.person.client.id
    else
      false
    end
  end

  def new?
    return true if user.has_role?(:admin)
    return false unless user.person&.employee?

    user.person.employee&.job_title&.has_role?(:create, Client) || false
  end

  def edit?
    return true if user.has_role?(:admin)
    return false unless user.person

    case user.person.agency_role
    when "Employee"
      return true if user.person.employee&.job_title&.has_role?(:update, Client)

      current_attendant?
    when "Client"
      user_has_client_role?(:update) && record.id == user.person.client.id
    else
      false
    end
  end

  def create?
    new?
  end

  def update?
    edit?
  end

  def destroy?
    return true if user.has_role?(:admin)
    return false unless user.person&.employee?

    user.person.employee&.job_title&.has_role?(:destroy, Client) || false
  end

  private

  def current_attendant?
    record.clients_attendants
      .where(attendant: user.person.employee)
      .exists?([
        "starts_at <= ? AND (ends_at IS NULL OR ends_at >= ?)",
        Time.current,
        Time.current
      ])
  end

  def user_has_client_role?(role_name)
    user.roles.exists?(name: role_name.to_s, resource_type: "Client", resource_id: nil)
  end
end
