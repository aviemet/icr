class ClientsManagerPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if user.has_role?(:admin)

      case user.person&.agency_role
      when "Employee"
        if user.person.employee&.job_title&.has_role?(:index, ClientsManager)
          scope.all
        else
          scope.none
        end
      else
        scope.none
      end
    end
  end
end
