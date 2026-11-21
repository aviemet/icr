class Employee::TrainingPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if user.has_role?(:admin)

      case user.person&.agency_role
      when "Employee"
        if user.person.employee&.job_title&.has_role?(:index, Employee::Training)
          scope.all
        else
          scope.joins(:employees_trainings)
            .where(employees_trainings: { employee_id: user.person.employee.id })
            .distinct
        end
      when "Client"
        scope.none
      else
        scope.none
      end
    end
  end

  def complete?
    standard_auth(:complete)
  end
end
