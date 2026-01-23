class DoctorPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if user.has_role?(:admin)

      case user.person&.agency_role
      when "Employee"
        if user.person.employee&.job_title&.has_role?(:index, Doctor)
          scope.all
        else
          scope.joins(:doctors_clients)
            .joins("INNER JOIN clients_attendants ON doctors_clients.client_id = clients_attendants.client_id")
            .where(clients_attendants: { attendant_id: user.person.employee.id })
            .where("clients_attendants.starts_at <= ? AND (clients_attendants.ends_at IS NULL OR clients_attendants.ends_at >= ?)", Time.current, Time.current)
            .distinct
        end
      when "Client"
        scope.joins(:doctors_clients)
          .where(doctors_clients: { client_id: user.person.client.id })
          .distinct
      else
        scope.none
      end
    end
  end
end
