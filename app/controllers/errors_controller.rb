class ErrorsController < ApplicationController
  # Important: Skip the error handling for this controller to prevent infinite redirects
  skip_before_action :verify_authenticity_token, only: [:show]

  # Most important - remove the error handling for this controller!
  def self.skip_handle_exceptions
    true
  end

  def show
    response.status = status

    server_error = flash[:server_error] if flash[:server_error].present?

    # Render the error page
    render inertia: "Errors/Show", props: {
      status: params[:status],
      server_error:
    }
  end
end
