class ShiftPolicy < ApplicationPolicy
  def facilitator_approve?
    return true if admin?
    return false unless user.person&.employee?
    return false unless job_title_allows?(:update, Timesheet)
    return false if job_title_allows?(:index, Timesheet) && !admin?

    caseload_owns_all_clients?
  end

  def facilitator_unapprove?
    facilitator_approve?
  end

  private

  def caseload_owns_all_clients?
    clients = Array(record.calendar_event&.clients)
    return false if clients.empty?

    managed_client_ids = current_employee.managed_clients.pluck(:id)
    clients.all? { |client| managed_client_ids.include?(client.id) }
  end
end
