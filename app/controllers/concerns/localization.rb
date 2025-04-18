require "active_support/concern"
require_relative "../../../lib/locales"

module Localization
  extend ActiveSupport::Concern

  included do
    before_action :set_locale

    around_action :apply_user_time_zone, if: :current_user
  end

  private

  def set_locale
    locale = params[:locale].to_s.strip.to_sym
    I18n.locale = I18n.available_locales.include?(locale) ? locale : I18n.default_locale
  end

  def apply_user_time_zone(&)
    Time.use_zone(current_user.time_zone, &)
  end
end
