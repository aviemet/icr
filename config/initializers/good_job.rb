Rails.application.configure do
  config.good_job = {
    on_thread_error: ->(exception) { Rails.error.report(exception) },
    shutdown_timeout: 60,
    dashboard_default_locale: :en,
    enable_cron: true,
    cron: {
      schedule_shifts: {
        cron: "0 0 * * *", # Midnight every day
        class: "ScheduleUpcomingShiftsJob"
      }
    }
  }
end
