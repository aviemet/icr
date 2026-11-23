# frozen_string_literal: true

class Clients::FaceSheetsController < Clients::BaseController
  # @route GET /clients/:slug/face_sheet (face_sheet_client)
  def show
    report_request = Reports::SyncExport.call(
      definition_slug: "client-face-sheet",
      user: current_user,
      params: { "client_id" => client.id },
    )

    unless report_request.status == "complete" && report_request.file.attached?
      redirect_to client_path(client), alert: t("reports.export_failed")
      return
    end

    send_data(
      report_request.file.download,
      filename: report_request.file.filename.to_s,
      type: report_request.file.content_type,
      disposition: "attachment",
    )
  end
end
