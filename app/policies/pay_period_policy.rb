class PayPeriodPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if user.has_role?(:admin)

      case user.person&.agency_role
      when "Employee"
        if user.person.employee&.job_title&.has_role?(:index, Timesheet)
          scope.all
        else
          scope.none
        end
      else
        scope.none
      end
    end
  end

  def index?
    return true if user.has_role?(:admin)
    return false unless user.person&.employee?

    user.person.employee.job_title&.has_role?(:index, Timesheet) || false
  end

  def show?
    return true if user.has_role?(:admin)
    return false unless user.person&.employee?

    user.person.employee.job_title&.has_role?(:show, Timesheet) || false
  end

  def finalize?
    update?
  end

  def export?
    update?
  end

  def create_adjustment?
    return true if user.has_role?(:admin)

    false
  end
end
