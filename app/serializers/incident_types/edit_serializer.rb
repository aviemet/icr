class IncidentTypes::EditSerializer < IncidentTypeSerializer

  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
