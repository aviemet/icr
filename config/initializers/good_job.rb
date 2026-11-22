Rails.application.configure do
  config.good_job = {
    on_thread_error: ->(exception) { Rails.error.report(exception) },
    shutdown_timeout: 60,
    dashboard_default_locale: :en,
    enable_cron: true,
    cron: {
      schedule_shifts: {
        cron: "0 0 * * *",
        class: "ScheduleUpcomingShiftsJob"
      },
      payroll_approval_reminders: {
        cron: "0 8 * * *",
        class: "Payroll::SendApprovalRemindersJob"
      },
      reports_purge_expired: {
        cron: "15 3 * * *",
        class: "Reports::PurgeExpiredJob"
      }
    }
  }
end
