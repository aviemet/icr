class Settings::CalendarsController < ApplicationController
  strong_params :settings, permit: Setting.editable_keys

  # @route GET /settings/calendar (settings_calendar)
  def show
    authorize Setting

    render inertia: "Settings/Calendar", props: {
      settings: -> { Setting.render },
    }
  end

  # @route PATCH /settings/calendar (settings_calendar)
  # @route PUT /settings/calendar (settings_calendar)
  def update
    authorize Setting

    ActiveRecord::Base.transaction do

      settings_params.each_key do |key|
        Setting.send("#{key}=", settings_params[key]) unless settings_params[key].nil?
      end

      redirect_to settings_calendar_path, success: t("settings.notices.updated")
    rescue StandardError
      flash[:error] = t("settings.errors.update_failed")
      redirect_to settings_calendar_path, inertia: { errors: ["There were errors"] }
    end
  end
end
