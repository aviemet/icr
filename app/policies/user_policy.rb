class UserPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if user.has_role?(:admin)

      case user.person&.agency_role
      when "Employee"
        if user.person.employee&.job_title&.has_role?(:index, User)
          scope.all
        else
          scope.where(id: user.id)
        end
      when "Client"
        scope.where(id: user.id)
      else
        scope.none
      end
    end
  end
end
