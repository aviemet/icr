class TimesheetPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if admin?

      case user.person&.agency_role
      when "Employee"
        if job_title_allows?(:index, Timesheet)
          scope.all
        else
          managed_ids = employee.managed_employees_managers.current.select(:employee_id)
          scope.where(employee_id: employee.id).or(scope.where(employee_id: managed_ids))
        end
      when "Client"
        scope.none
      else
        scope.none
      end
    end
  end

  def index?
    return true if admin?
    return false unless user.person&.employee?

    job_title_allows?(:index, Timesheet) || job_title_allows?(:show, Timesheet) || job_title_allows?(:update, Timesheet)
  end

  def show?
    return true if admin?
    return false unless user.person&.employee?

    return true if job_title_allows?(:show, Timesheet) && in_scope?
    return true if record.employee_id == current_employee.id

    manages_employee?(record.employee)
  end

  def update?
    return true if admin?
    return false unless user.person&.employee?
    return false unless job_title_allows?(:update, Timesheet)

    return true if job_title_allows?(:index, Timesheet) && in_scope?

    manages_employee?(record.employee)
  end

  def edit?
    update?
  end

  def final_approve?
    return true if admin?
    return false unless user.person&.employee?
    return false unless job_title_allows?(:update, Timesheet)

    job_title_allows?(:index, Timesheet) && in_scope?
  end

  def final_unapprove?
    final_approve?
  end

  private

  def in_scope?
    self.class::Scope.new(user, Timesheet).resolve.exists?(id: record.id)
  end
end
