class IncidentReports::EditSerializer < IncidentReportSerializer

  attributes(
    :id,
    :updated_at,
    :created_at,
  )
end
