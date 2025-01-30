class PayrollPolicy < ApplicationPolicy

  class Scope < ApplicationPolicy::Scope
  end

  def index?
    return true if admin?

    if user.person&.employee?
      return user.person.employee&.job_title&.has_permission?(:payroll, :index)
    end

    false
  end

  def show?
    return true if admin?

    if user.person&.employee?
      return user.person.employee&.job_title&.has_permission?(:payroll, :show)
    end

    false
  end

  def create?
    return true if admin?

    if user.person&.employee?
      return user.person.employee&.job_title&.has_permission?(:payroll, :create)
    end

    false
  end

  def new?
    create?
  end

  def edit?
    if user.person&.employee?
      return user.person.employee&.job_title&.has_permission?(:payroll, :edit)
    end

    false
  end

  def update?
    edit?
  end

  def destroy?
    return true if admin?

    if user.person&.employee?
      return user.person.employee&.job_title&.has_permission?(:payroll, :destroy)
    end

    false
  end
end
