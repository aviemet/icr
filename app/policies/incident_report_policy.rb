class IncidentReportPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if user.has_role?(:admin)

      case user.person&.agency_role
      when "Employee"
        if user.person.employee&.job_title&.has_role?(:index, IncidentReport)
          scope.all
        else
          person_id = user.person.employee.person_id
          scope.where("reported_by_id = ? OR reported_to_id = ?", person_id, person_id)
        end
      when "Client"
        scope.where(client_id: user.person.client.id)
      else
        scope.none
      end
    end
  end
end
