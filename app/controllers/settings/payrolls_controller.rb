class Settings::PayrollsController < ApplicationController
  strong_params :settings, permit: Setting.editable_keys

  # @route GET /settings/payroll/schedule (settings_payroll_schedule)
  def schedule
    authorize Setting, :show?

    render inertia: "Settings/Payroll/Schedule", props: {
      settings: -> { Setting.render },
    }
  end

  # @route PUT /settings/payroll/schedule (settings_payroll_schedule)
  # @route PATCH /settings/payroll/schedule (settings_payroll_schedule)
  def update_schedule
    authorize Setting, :update?
    update_settings(settings_payroll_schedule_path)
  end

  # @route GET /settings/payroll/overtime (settings_payroll_overtime)
  def overtime
    authorize Setting, :show?

    render inertia: "Settings/Payroll/Overtime", props: {
      settings: -> { Setting.render },
      shift_types: -> { ServiceType.ordered.render },
      service_types: -> { ServiceType.ordered.render },
      overtime_exemptions: -> { OvertimeExemption.order(:name).map(&:render) },
    }
  end

  # @route PUT /settings/payroll/overtime (settings_payroll_overtime)
  # @route PATCH /settings/payroll/overtime (settings_payroll_overtime)
  def update_overtime
    authorize Setting, :update?

    if double_time_below_daily_overtime?
      message = t("settings.errors.double_time_below_daily_overtime")
      redirect_to settings_payroll_overtime_path,
        alert: message,
        inertia: { errors: { "settings.overtime_daily_double_time_hours" => message } }
      return
    end

    update_settings(settings_payroll_overtime_path)
  end

  # @route GET /settings/payroll/ihss (settings_payroll_ihss)
  def ihss
    authorize Setting, :show?

    render inertia: "Settings/Payroll/Ihss", props: {
      settings: -> { Setting.render },
    }
  end

  # @route PUT /settings/payroll/ihss (settings_payroll_ihss)
  # @route PATCH /settings/payroll/ihss (settings_payroll_ihss)
  def update_ihss
    authorize Setting, :update?
    update_settings(settings_payroll_ihss_path)
  end

  private

  def update_settings(redirect_path)
    ActiveRecord::Base.transaction do
      settings_params.each_key do |key|
        Setting.send("#{key}=", settings_params[key]) unless settings_params[key].nil?
      end
    end

    redirect_to redirect_path, success: t("settings.notices.updated")
  rescue ActiveRecord::RecordInvalid => e
    Setting.clear_cache
    redirect_to redirect_path, alert: t("settings.errors.update_failed"), inertia: { errors: e.record.errors }
  rescue StandardError
    Setting.clear_cache
    redirect_to redirect_path, alert: t("settings.errors.update_failed"), inertia: { errors: ["There were errors"] }
  end

  def double_time_below_daily_overtime?
    daily = settings_params.fetch(:overtime_daily_hours, Setting.overtime_daily_hours)
    double_time = settings_params.fetch(:overtime_daily_double_time_hours, Setting.overtime_daily_double_time_hours)
    return false if daily.blank? || double_time.blank?

    Integer(double_time.to_s, exception: false).to_i < Integer(daily.to_s, exception: false).to_i
  end
end
