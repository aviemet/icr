class SettingsController < ApplicationController
  strong_params :setting, permit: Setting.editable_keys

  # @route GET /settings (settings)
  def index
    authorize Setting

    render inertia: "Settings/Index", props: {
      settings: -> { Setting.render },
    }
  end

  # @route PUT /settings (settings)
  # @route PATCH /settings (settings)
  def update
    authorize Setting

    ActiveRecord::Base.transaction do

      setting_params.each_key do |key|
        Setting.send("#{key}=", setting_params[key].strip) unless setting_params[key].nil?
      end

      redirect_to settings_path, success: t("settings.notices.updated")
    rescue StandardError
      redirect_to settings_path, inertia: { errors: setting.errors }
    end
  end
end
