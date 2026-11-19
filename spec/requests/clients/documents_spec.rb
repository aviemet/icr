require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "/clients/:client_slug/documents" do
  login_user(:admin)

  describe "POST /create" do
    it "attaches a document to the client" do
      client = create(:client)
      file = fixture_file_upload(
        Rails.root.join("spec/fixtures/files/sample.pdf"),
        "application/pdf",
      )

      expect {
        post client_documents_url(client), params: { document: file }
      }.to change { client.reload.documents.count }.by(1)

      expect(response).to redirect_to(client_url(client, tab: "documents"))
    end
  end
end
