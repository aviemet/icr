class PayrollPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if user.has_role?(:admin)

      case user.person&.agency_role
      when "Employee"
        if user.person.employee&.job_title&.has_role?(:index, Setting)
          scope.all
        else
          scope.none
        end
      when "Client"
        scope.none
      else
        scope.none
      end
    end
  end

  def index?
    return true if user.has_role?(:admin)
    return false unless user.person&.employee?

    user.person.employee.job_title&.has_role?(:index, Setting) || false
  end

  def show?
    return true if user.has_role?(:admin)
    return false unless user.person&.employee?

    user.person.employee.job_title&.has_role?(:show, Setting) || false
  end

  def create?
    return true if user.has_role?(:admin)
    return false unless user.person&.employee?

    user.person.employee.job_title&.has_role?(:create, Setting) || false
  end

  def new?
    create?
  end

  def edit?
    return true if user.has_role?(:admin)
    return false unless user.person&.employee?

    user.person.employee.job_title&.has_role?(:update, Setting) || false
  end

  def update?
    edit?
  end

  def destroy?
    return true if user.has_role?(:admin)
    return false unless user.person&.employee?

    user.person.employee.job_title&.has_role?(:destroy, Setting) || false
  end
end
