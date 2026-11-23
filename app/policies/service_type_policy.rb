class ServiceTypePolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if admin?
      return scope.all if job_title_allows?(:index, ServiceType)

      scope.none
    end
  end
end
