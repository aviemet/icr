class IncidentTypes::IndexSerializer < IncidentTypeSerializer
  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
