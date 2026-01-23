class SettingPolicy < ApplicationPolicy
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
end
