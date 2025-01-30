class SettingsController < ApplicationController
  strong_params :settings, permit: Setting.editable_keys

  # @route GET /settings/general (settings_general)
  # @route GET /settings (settings)
  def show
    authorize Setting

    render inertia: "Settings/General", props: {
      settings: -> { Setting.render },
    }
  end

  # @route PATCH /settings (settings)
  # @route PUT /settings (settings)
  def update
    authorize Setting

    ActiveRecord::Base.transaction do

      settings_params.each_key do |key|
        Setting.send("#{key}=", settings_params[key].strip) unless settings_params[key].nil?
      end

      redirect_to settings_path, success: t("settings.notices.updated")
    rescue StandardError
      redirect_to settings_path, inertia: { errors: ["There were errors"] }
    end
  end
end
