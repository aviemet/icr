class TimesheetPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if user.has_role?(:admin)

      case user.person&.agency_role
      when "Employee"
        if user.person.employee&.job_title&.has_role?(:index, Timesheet)
          scope.all
        else
          scope.where(employee_id: user.person.employee.id)
        end
      when "Client"
        scope.none
      else
        scope.none
      end
    end
  end
end
