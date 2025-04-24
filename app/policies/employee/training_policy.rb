class Employee::TrainingPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      # Admins can see all trainings
      return scope.all if user.has_role?(:admin)

      case user.person&.agency_role
      when "Employee"
        if user.person.employee&.job_title&.has_role?(:index, Employee::Training)
          scope.all
        else
          # Return trainings assigned to the employee
          scope.joins(:employee_trainings)
            .where(employee_trainings: { employee_id: user.person.employee.id })
            .distinct
        end
      when "Client"
        # Clients don't have access to trainings
        scope.none
      else
        scope.none
      end
    end
  end
end
