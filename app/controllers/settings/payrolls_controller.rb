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

      redirect_to redirect_path, success: t("settings.notices.updated")
    rescue StandardError
      flash[:error] = t("settings.errors.update_failed")
      redirect_to redirect_path, inertia: { errors: ["There were errors"] }
    end
  end
end
