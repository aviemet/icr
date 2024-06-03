class IncidentTypes::ShowSerializer < IncidentTypeSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
