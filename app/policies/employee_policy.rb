class EmployeePolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      # Admins can see all employees
      return scope.all if user.has_role?(:admin)

      case user.person&.agency_role
      when "Employee"
        if user.person.employee&.job_title&.has_role?(:index, Employee)
          scope.all
        else
          # Return only the employee's own record
          scope.where(id: user.person.employee.id)
        end
      when "Client"
        # Clients can see their current attendants
        scope.joins(:clients_attendants)
          .where(clients_attendants: { client_id: user.person.client.id })
          .where("clients_attendants.starts_at <= ? AND (clients_attendants.ends_at IS NULL OR clients_attendants.ends_at >= ?)", Time.current, Time.current)
          .distinct
      else
        scope.none
      end
    end
  end
end
