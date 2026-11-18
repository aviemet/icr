class ClientPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if admin?

      case user.person&.agency_role
      when "Employee"
        if job_title_allows?(:index, Client)
          scope.all
        else
          attendant_ids = ClientsAttendant.current.where(attendant_id: employee.id).select(:client_id)
          managed_ids = ClientsManager.current.where(manager_id: employee.id).select(:client_id)
          scope.where(id: attendant_ids).or(scope.where(id: managed_ids))
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
    return true if admin?
    return false unless user.person

    case user.person.agency_role
    when "Employee"
      return true if job_title_allows?(:index, Client)

      current_employee.clients_attendants.current.exists? ||
        current_employee.clients_managers.current.exists?
    when "Client"
      user_has_client_role?(:index)
    else
      false
    end
  end

  def show?
    return true if admin?
    return false unless user.person

    case user.person.agency_role
    when "Employee"
      return true if job_title_allows?(:show, Client)

      current_attendant? || manages_client?
    when "Client"
      user_has_client_role?(:show) && record.id == user.person.client.id
    else
      false
    end
  end

  def schedule?
    show?
  end

  def create?
    return true if admin?
    return false unless user.person&.employee?

    job_title_allows?(:create, Client)
  end

  def new?
    create?
  end

  def update?
    return true if admin?
    return false unless user.person

    case user.person.agency_role
    when "Employee"
      return true if job_title_allows?(:update, Client)

      manages_client?
    when "Client"
      user_has_client_role?(:update) && record.id == user.person.client.id
    else
      false
    end
  end

  def edit?
    update?
  end

  def destroy?
    return true if admin?
    return false unless user.person&.employee?

    job_title_allows?(:destroy, Client)
  end

  private

  def user_has_client_role?(role_name)
    user.roles.exists?(name: role_name.to_s, resource_type: "Client", resource_id: nil)
  end
end
