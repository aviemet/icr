class Employee::InterviewPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if admin?
      return scope.all if job_title_allows?(:show, Employee) || job_title_allows?(:index, Employee)

      scope.none
    end
  end

  def index?
    return true if admin?

    job_title_allows?(:index, Employee) || job_title_allows?(:show, Employee)
  end

  def show?
    return true if admin?

    job_title_allows?(:show, Employee)
  end

  def create?
    return true if admin?

    job_title_allows?(:update, Employee) || job_title_allows?(:create, Employee)
  end

  def update?
    return true if admin?

    job_title_allows?(:update, Employee)
  end

  def destroy?
    return true if admin?

    job_title_allows?(:update, Employee) || job_title_allows?(:destroy, Employee)
  end
end
