require "active_support/concern"

module ErrorHandling
  extend ActiveSupport::Concern

  included do
    rescue_from(ActiveRecord::RecordNotFound) do |exception|
      handle_exception(exception, 404)
    end

    # TODO: Handle 401, 403, 422 errors

    rescue_from(StandardError) do |exception|
      handle_exception(exception, 505)
    end

    protected

    def handle_exception(exception, status)
      logger.error exception
      render_error(exception, status)

      error_method_name = "error_#{status}_path"

      redirect_to send(error_method_name), inertia: {
        exception:,
        status:,
      }
    end

  end
end
