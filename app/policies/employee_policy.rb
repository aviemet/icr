class EmployeePolicy < ApplicationPolicy
  def schedule?
    show?
  end

  def show?
    return true if admin?
    return false unless user.person

    case user.person.agency_role
    when "Employee"
      return true if job_title_allows?(:show, Employee)
      return true if record.id == current_employee.id

      manages_employee?
    when "Client"
      attendant_for_client?
    else
      false
    end
  end

  def update?
    return true if admin?
    return false unless user.person&.employee?

    return true if job_title_allows?(:update, Employee)

    manages_employee?
  end

  def edit?
    update?
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if admin?

      case user.person&.agency_role
      when "Employee"
        if job_title_allows?(:index, Employee)
          scope.all
        else
          managed_ids = employee.managed_employees_managers.current.select(:employee_id)
          scope.where(id: employee.id).or(scope.where(id: managed_ids))
        end
      when "Client"
        scope.joins(:clients_attendants)
          .where(clients_attendants: { client_id: user.person.client.id })
          .merge(ClientsAttendant.current)
          .distinct
      else
        scope.none
      end
    end
  end

  private

  def attendant_for_client?
    return false unless user.person&.client

    record.clients_attendants.current.exists?(client: user.person.client)
  end
end
