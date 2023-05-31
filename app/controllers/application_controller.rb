class ApplicationController < ActionController::Base
  around_action :apply_user_time_zone, if: :current_user

  protect_from_forgery with: :exception

  # Inertia requests do not need authenticity verification as they are not
  # subject to the same vulnerability as a standard web request
  skip_before_action :verify_authenticity_token, if: -> { request.inertia? }

  add_flash_types :success, :error, :warning

  before_action :set_locale
  before_action :authenticate_user!

  include Inertia::Flash
  include Inertia::Auth

  def pagination_data(model)
    return if !model.respond_to? :total_pages

    {
      pages: model.total_pages,
      limit: model.limit_value,
      current_page: model.current_page,
      next_page: model.next_page,
      prev_page: model.prev_page,
      is_first_page: model.first_page?,
      is_last_page: model.last_page?
    }
  end

  private

  def apply_user_time_zone(&)
    Time.use_zone(current_user.time_zone, &)
  end

  def set_locale
    locale = params[:locale].to_s.strip.to_sym
    I18n.locale = I18n.available_locales.include?(locale) ? locale : I18n.default_locale
  end
end
