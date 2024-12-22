class ErrorsController < ApplicationController

  def not_found
    render inertia: "Errors/NotFound"
  end

  def unprocessable_entity
    render inertia: "Errors/UnprocessableEntity"
  end

  def internal_server_error
    render inertia: "Errors/InternalServerError"
  end
end
