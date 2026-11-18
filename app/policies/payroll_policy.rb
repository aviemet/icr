class PayrollPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      raise NotImplementedError, "Payroll is not an ActiveRecord model; authorize Timesheet actions instead"
    end
  end

  def index?
    return true if admin?
    return false unless user.person&.employee?

    job_title_allows?(:index, Timesheet)
  end

  def show?
    return true if admin?
    return false unless user.person&.employee?

    job_title_allows?(:show, Timesheet)
  end

  def create?
    return true if admin?
    return false unless user.person&.employee?

    job_title_allows?(:create, Timesheet)
  end

  def new?
    create?
  end

  def update?
    return true if admin?
    return false unless user.person&.employee?

    job_title_allows?(:update, Timesheet)
  end

  def edit?
    update?
  end

  def destroy?
    return true if admin?
    return false unless user.person&.employee?

    job_title_allows?(:destroy, Timesheet)
  end
end
