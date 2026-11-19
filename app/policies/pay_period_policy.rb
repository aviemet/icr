class PayPeriodPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if admin?

      case user.person&.agency_role
      when "Employee"
        if timesheet_queue_access? || timesheet_review_access?
          scope.all
        else
          scope.none
        end
      else
        scope.none
      end
    end

    private

    def timesheet_queue_access?
      job_title_allows?(:index, Timesheet)
    end

    def timesheet_review_access?
      job_title_allows?(:show, Timesheet) || job_title_allows?(:update, Timesheet)
    end
  end

  def index?
    return true if admin?
    return false unless user.person&.employee?

    timesheet_queue_access? || timesheet_review_access?
  end

  def show?
    return true if admin?
    return false unless user.person&.employee?

    timesheet_queue_access? || timesheet_review_access?
  end

  def finalize?
    update?
  end

  def export?
    update?
  end

  def create_adjustment?
    return true if admin?

    false
  end

  def update?
    return true if admin?
    return false unless user.person&.employee?

    timesheet_queue_access?
  end

  private

  def timesheet_queue_access?
    job_title_allows?(:index, Timesheet)
  end

  def timesheet_review_access?
    job_title_allows?(:show, Timesheet) || job_title_allows?(:update, Timesheet)
  end
end
