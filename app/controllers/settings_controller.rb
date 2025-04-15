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
        Setting.send("#{key}=", settings_params[key].to_s.strip) unless settings_params[key].nil?
      end

      redirect_to settings_path, success: t("settings.notices.updated")
    rescue ActiveRecord::RecordInvalid => e
      Rails.logger.error "Settings validation failed: #{e.message}"
      flash[:error] = t("settings.errors.update_failed")

      redirect_to settings_path, inertia: { errors: e.record.errors }
    rescue StandardError => e
      Rails.logger.error "Settings update failed: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")

      errors = ActiveModel::Errors.new(Setting)
      errors.add(:base, e.message)
      flash[:error] = t("settings.errors.update_failed")

      redirect_to settings_path, inertia: { errors: errors }
    end
  end
end
