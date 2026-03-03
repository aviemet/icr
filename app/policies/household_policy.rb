class HouseholdPolicy < ApplicationPolicy
  # NOTE: Up to Pundit v2.3.1, the inheritance was declared as
  # `Scope < Scope` rather than `Scope < ApplicationPolicy::Scope`.
  # In most cases the behavior will be identical, but if updating existing
  # code, beware of possible changes to the ancestors:
  # https://gist.github.com/Burgestrand/4b4bc22f31c8a95c425fc0e30d7ef1f5

  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if user.has_role?(:admin)

      case user.person&.agency_role
      when "Employee"
        if user.person.employee&.job_title&.has_role?(:index, Household)
          scope.all
        else
          scope.joins(:households_clients)
            .joins("INNER JOIN clients_attendants ON households_clients.client_id = clients_attendants.client_id")
            .where(clients_attendants: { attendant_id: user.person.employee.id })
            .where(
              "clients_attendants.starts_at <= ? AND (clients_attendants.ends_at IS NULL OR clients_attendants.ends_at >= ?)",
              Time.current,
              Time.current,
            )
            .distinct
        end
      when "Client"
        scope.joins(:households_clients)
          .where(households_clients: { client_id: user.person.client.id })
          .distinct
      else
        scope.none
      end
    end
  end
end
