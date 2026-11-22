unless Setting.unscoped.exists?(var: "notifications_payroll_approval_reminders")
  Setting.notifications_payroll_approval_reminders = true
end

Rails.logger.info "[seeds] settings defaults"
