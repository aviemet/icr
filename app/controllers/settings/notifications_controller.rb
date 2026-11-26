class Settings::NotificationsController < ApplicationController
  strong_params :settings, permit: Setting.editable_keys

  # @route GET /settings/notifications (settings_notifications)
  def show
    authorize Setting, :show?

    render inertia: "Settings/Notifications", props: {
      settings: -> { Setting.render },
    }
  end

  # @route PUT /settings/notifications (settings_notifications)
  # @route PATCH /settings/notifications (settings_notifications)
  def update
    authorize Setting, :update?

    ActiveRecord::Base.transaction do
      settings_params.each_key do |key|
        Setting.send("#{key}=", settings_params[key]) unless settings_params[key].nil?
      end

      redirect_back_or_to settings_notifications_path, success: t("settings.notices.updated")
    rescue StandardError
      redirect_back_or_to settings_notifications_path, alert: t("settings.errors.update_failed"), inertia: { errors: ["There were errors"] }
    end
  end
end
