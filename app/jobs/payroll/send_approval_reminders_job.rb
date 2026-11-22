class Payroll::SendApprovalRemindersJob < ApplicationJob
  queue_as :default

  def perform
    Payroll::SendApprovalReminders.call
  end
end
