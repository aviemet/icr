class Settings::PayrollsController < ApplicationController
  # @route GET /settings/payroll (settings_payroll)
  def show
    authorize Setting

    render inertia: "Settings/Payroll", props: {
      settings: -> { Setting.render },
      shift_types: -> { Category.type "Shift" }
    }
  end

  # @route PATCH /settings/payroll (settings_payroll)
  # @route PUT /settings/payroll (settings_payroll)
  def update
    authorize Setting

    ActiveRecord::Base.transaction do

      settings_params.each_key do |key|
        Setting.send("#{key}=", settings_params[key].strip) unless settings_params[key].nil?
      end

      redirect_to settings_payroll_path, success: t("settings.notices.updated")
    rescue StandardError
      redirect_to settings_payroll_path, inertia: { errors: ["There were errors"] }
    end
  end
end
