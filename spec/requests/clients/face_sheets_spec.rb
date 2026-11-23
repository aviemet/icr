# frozen_string_literal: true

require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Clients::FaceSheets" do
  login_user(:admin)

  let(:client) { create(:client) }

  describe "GET /clients/:slug/face_sheet" do
    it "downloads a PDF even when the system definition was never seeded" do
      ReportDefinition.where(slug: "client-face-sheet").delete_all

      get face_sheet_client_url(client)

      expect(response).to have_http_status(:ok)
      expect(response.media_type).to eq("application/pdf")
      expect(response.body).to start_with("%PDF")

      request = ReportRequest.last
      expect(request).to be_present
      expect(request.status).to eq("complete")
      expect(request.definition_snapshot["slug"]).to eq("client-face-sheet")
      expect(request.params["client_id"]).to eq(client.id)
      expect(request.file).to be_attached
      expect(ReportDefinition.find_by(slug: "client-face-sheet")).to be_present
    end
  end
end
