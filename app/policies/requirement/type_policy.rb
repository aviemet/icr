class Requirement::TypePolicy < ApplicationPolicy
  def index?
    manages_requirements?(:index)
  end

  def show?
    manages_requirements?(:show)
  end

  def create?
    manages_requirements?(:create)
  end

  def update?
    manages_requirements?(:update)
  end

  def destroy?
    manages_requirements?(:destroy)
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if user.has_role?(:admin)

      if user.person&.employee&.job_title&.has_role?(:index, Requirement::Requirement)
        scope.all
      else
        scope.none
      end
    end
  end

  private

  def manages_requirements?(action)
    return true if admin?

    job_title_allows?(action, Requirement::Requirement)
  end
end
