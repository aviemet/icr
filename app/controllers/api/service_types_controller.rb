class Api::ServiceTypesController < Api::ApiController
  expose :service_types, -> { policy_scope(ServiceType).active.ordered }

  # @route GET /api/service_types (api_service_types)
  def index
    authorize ServiceType

    render json: service_types.render
  end

  # @route GET /api/options/service_types (api_service_types_options)
  def options
    authorize ServiceType, :index?

    render json: service_types.render(:options)
  end
end
