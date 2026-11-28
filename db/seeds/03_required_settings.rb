unless Setting.unscoped.exists?(var: "notifications_payroll_approval_reminders")
  Setting.notifications_payroll_approval_reminders = true
end

unless Setting.unscoped.exists?(var: "ihss_co_employer")
  Setting.ihss_co_employer = true
end

unless Setting.unscoped.exists?(var: "overtime_workweek_start")
  weekday = if Setting.unscoped.exists?(var: "payroll_period_day")
              Setting.payroll_period_day
            else
              "monday"
            end
  weekday = "monday" unless WEEKDAYS.include?(weekday)
  Setting.overtime_workweek_start = weekday
end

unless Setting.unscoped.exists?(var: "overtime_daily_double_time_hours")
  Setting.overtime_daily_double_time_hours = 12
end

unless Setting.unscoped.exists?(var: "overtime_seventh_day_double_time_hours")
  Setting.overtime_seventh_day_double_time_hours = 8
end

unless Setting.unscoped.exists?(var: "overtime_personal_attendant_daily_hours")
  Setting.overtime_personal_attendant_daily_hours = 9
end

unless Setting.unscoped.exists?(var: "overtime_personal_attendant_weekly_hours")
  Setting.overtime_personal_attendant_weekly_hours = 45
end

Rails.logger.info "[seeds] settings defaults"
