class Settings::ServiceTypesController < ApplicationController
  # @route GET /settings/calendar/service_types (settings_service_types)
  def index
    authorize ServiceType

    render inertia: "Settings/Calendar/ServiceTypes", props: {
      service_types: -> { policy_scope(ServiceType).ordered.render },
    }
  end

  # @route POST /settings/calendar/service_types (settings_service_types)
  def create
    authorize ServiceType

    service_type = ServiceType.new(service_type_params)
    service_type.position = ServiceType.maximum(:position).to_i + 1 if service_type.position.blank? || service_type.position.zero?
    service_type.system = false

    if service_type.save
      redirect_to settings_service_types_path, notice: t("templates.controllers.notices.created", model: ServiceType.model_name.human)
    else
      redirect_to settings_service_types_path, inertia: { errors: service_type.errors }
    end
  end

  # @route PATCH /settings/calendar/service_types/:slug (settings_service_type)
  # @route PUT /settings/calendar/service_types/:slug (settings_service_type)
  def update
    service_type = find_service_type
    authorize service_type

    if service_type.update(service_type_params)
      redirect_to settings_service_types_path, notice: t("templates.controllers.notices.updated", model: ServiceType.model_name.human)
    else
      redirect_to settings_service_types_path, inertia: { errors: service_type.errors }
    end
  end

  # @route DELETE /settings/calendar/service_types/:slug (settings_service_type)
  def destroy
    service_type = find_service_type
    authorize service_type

    if service_type.system?
      redirect_to settings_service_types_path, alert: t("service_types.errors.system_protected")
      return
    end

    if service_type.destroy
      redirect_to settings_service_types_path, notice: t("templates.controllers.notices.destroyed", model: ServiceType.model_name.human)
    else
      redirect_to settings_service_types_path, alert: service_type.errors.full_messages.to_sentence
    end
  end

  private

  def find_service_type
    ServiceType.friendly.find(params.expect(:slug))
  end

  def service_type_params
    params.expect(
      service_type: [:name,
                     :active,
                     :position,
                     :billable,
                     :payable,
                     :allows_multi_client,
                     :requires_notes,
                     :tracks_mileage,
                     :color],
    )
  end
end
