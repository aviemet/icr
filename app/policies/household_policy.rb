class HouseholdPolicy < ApplicationPolicy
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
          scope.joins(:current_households_clients)
            .where(households_clients: { client_id: attendant_ids })
            .or(
              scope.joins(:current_households_clients)
                .where(households_clients: { client_id: managed_ids }),
            )
            .distinct
        end

      when "Client"
        scope.joins(:current_households_clients)
          .where(households_clients: { client_id: user.person.client.id })
          .distinct
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
      current_employee.present?
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
      return true if job_title_allows?(:show, Client) || job_title_allows?(:index, Client)

      household_for_assigned_client?
    when "Client"
      household_for_own_client?
    else
      false
    end
  end

  def schedule?
    show?
  end

  private

  def household_for_assigned_client?
    return false unless current_employee

    client_ids = record.current_households_clients.select(:client_id)
    ClientsAttendant.current.exists?(attendant: current_employee, client_id: client_ids) ||
      ClientsManager.current.exists?(manager: current_employee, client_id: client_ids)
  end

  def household_for_own_client?
    return false unless user.person&.client

    record.current_households_clients.exists?(client_id: user.person.client.id)
  end
end
