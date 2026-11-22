# frozen_string_literal: true

class ReportRequests::IndexSerializer < ReportRequestSerializer
  attributes(
    :id,
    :created_at,
    :updated_at,
  )

  type "string", optional: false
  def name
    @object.definition_snapshot["name"] || @object.report_definition&.name
  end

  type "string", optional: true
  def download_path
    return nil unless @object.status == "complete" && @object.file.attached?

    Rails.application.routes.url_helpers.download_report_request_path(@object)
  end

  type "string", optional: true
  def requested_by_name
    @object.requested_by&.person&.name
  end
end
