class ServiceTypes::OptionsSerializer < ApplicationSerializer
  object_as :service_type, model: "ServiceType"

  include Persisted

  attributes(
    :name,
    :slug,
    :color,
    :billable,
    :payable,
    :allows_multi_client,
    :requires_notes,
    :tracks_mileage,
    :active,
  )
end
