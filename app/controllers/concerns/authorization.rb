require "active_support/concern"

module Authorization
  extend ActiveSupport::Concern

  included do
    include Pundit::Authorization

    rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  end

  private

  def user_not_authorized(_exception)
    flash[:warning] = t("pundit.not_authorized")
    redirect_to request.referer || root_path
  end
end
