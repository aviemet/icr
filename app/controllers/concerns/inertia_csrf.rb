require "active_support/concern"

# Store the CSRF token in a non-session cookie so Axios can access it
# Name it as XSRF-TOKEN, because this is the Axios default
#
# More info: https://pragmaticstudio.com/tutorials/rails-session-cookies-for-api-authentication
#
module InertiaCsrf
  extend ActiveSupport::Concern

  included do
    protect_from_forgery with: :exception

    # Inertia requests do not need authenticity verification as they are not
    # subject to the same vulnerability as a standard web request
    skip_before_action :verify_authenticity_token, if: -> { request.inertia? }

    before_action :set_csrf_cookie

    rescue_from ActionController::InvalidAuthenticityToken do
      redirect_back fallback_location: "/", notice: I18n.t("application.invalid_authenticity_token_notice")
    end
  end

  # Rails uses HTTP_X_CSRF_TOKEN, but axios sends HTTP_X_XSRF_TOKEN (different name, X instead of C)
  # By overriding `request_authenticity_tokens` we can tell Rails to check HTTP_X_XSRF_TOKEN, too
  # Source: https://github.com/rails/rails/blob/v6.0.3.2/actionpack/lib/action_controller/metal/request_forgery_protection.rb#L305-L308
  def request_authenticity_tokens
    super << request.headers["HTTP_X_XSRF_TOKEN"]
  end

  private

  def set_csrf_cookie
    cookies["XSRF-TOKEN"] = {
      value: form_authenticity_token,
      same_site: "Strict"
    }
  end
end
