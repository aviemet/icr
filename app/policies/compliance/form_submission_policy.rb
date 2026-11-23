class Compliance::FormSubmissionPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      return scope.all if admin?
      return scope.none unless job_title_allows?(:index, Compliance::FormSubmission)

      if job_title_allows?(:index, Compliance::FormSubmission)
        caseload_client_ids = managed_client_ids
        return scope.all if caseload_client_ids.nil?

        scope.for_client_ids(caseload_client_ids)
      else
        scope.none
      end
    end

    private

    def managed_client_ids
      return nil if job_title_allows?(:index, Client)

      employee_record = employee
      return [] if employee_record.blank?

      ClientsManager.current.where(manager_id: employee_record.id).pluck(:client_id)
    end
  end

  def index?
    standard_auth(:index)
  end

  def show?
    return true if admin?
    return false unless standard_auth(:show)
    return true if job_title_allows?(:index, Client)

    in_caseload?
  end

  def create?
    standard_auth(:create)
  end

  def update?
    return true if admin?
    return false unless standard_auth(:update)
    return true if job_title_allows?(:index, Client)

    in_caseload?
  end

  def destroy?
    standard_auth(:destroy)
  end

  def submit?
    update?
  end

  def close?
    update? && (admin? || job_title_allows?(:index, Client))
  end

  private

  def in_caseload?
    return false if employee.blank?

    client_ids = ClientsManager.current.where(manager_id: employee.id).pluck(:client_id)
    return true if record.client_id.present? && client_ids.include?(record.client_id)
    return false if record.household_id.blank?

    HouseholdsClient.exists?(household_id: record.household_id, client_id: client_ids)
  end
end
