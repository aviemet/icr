unless Setting.unscoped.exists?(var: "notifications_payroll_approval_reminders")
  Setting.notifications_payroll_approval_reminders = true
end

unless Setting.unscoped.exists?(var: "ihss_co_employer")
  Setting.ihss_co_employer = true
end

Rails.logger.info "[seeds] settings defaults"
