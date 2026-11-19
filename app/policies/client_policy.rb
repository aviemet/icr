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
        scope.where(id: user.person.client.id)
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
      user.person.client.present?
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
      own_client?
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
      own_client?
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

  def own_client?
    user.person.client.present? && record.id == user.person.client.id
  end
end
