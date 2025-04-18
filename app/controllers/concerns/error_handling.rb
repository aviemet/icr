require "active_support/concern"

module ErrorHandling
  extend ActiveSupport::Concern

  included do
    # Skip error handling in test environment or if skipped by controller
    unless !Rails.env.production? || (self.respond_to?(:skip_handle_exceptions) && self.skip_handle_exceptions)

      # Order matters: more general errors first, more specific errors last

      # 500: Server Error - Catch all standard errors
      rescue_from(StandardError) do |exception|
        handle_exception(exception, 500)
      end

      # 503: Service Unavailable
      rescue_from(
        Net::OpenTimeout,
        Net::ReadTimeout,
        Errno::ECONNREFUSED,
      ) do |exception|
        handle_exception(exception, 503)
      end

      # 404: Page Not Found
      rescue_from(
        ActiveRecord::RecordNotFound,
        ActionController::RoutingError,
        AbstractController::ActionNotFound,
      ) do |exception|
        handle_exception(exception, 404)
      end

      # 403: Forbidden
      rescue_from(
        Pundit::NotAuthorizedError,
      ) do |exception|
        handle_exception(exception, 403)
      end
    end

    protected

    def handle_exception(exception, status)
      logger.error exception

      error_details = if Rails.env.development?
                        {
                          message: exception.message,
                          backtrace: exception.backtrace&.first(5),
                          class: exception.class.name
                        }
                      end

      redirect_to error_path(status:), flash: {
        server_error: error_details,
      }
    end
  end
end
