class Compliance::FormTemplatePolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if admin?
      return scope.none unless job_title_allows?(:index, Compliance::FormTemplate)

      scope.all
    end
  end

  def index?
    standard_auth(:index)
  end

  def show?
    standard_auth(:show)
  end

  def create?
    standard_auth(:create)
  end

  def update?
    standard_auth(:update)
  end

  def destroy?
    return false if record.respond_to?(:system) && record.system

    standard_auth(:destroy)
  end
end
