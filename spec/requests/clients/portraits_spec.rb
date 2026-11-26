require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "/clients/:client_slug/portrait" do
  login_user(:admin)

  describe "POST /create" do
    it "attaches a portrait to the client" do
      client = create(:client)
      file = fixture_file_upload(
        Rails.root.join("spec/fixtures/files/sample.png"),
        "image/png",
      )

      expect {
        post client_portrait_url(client), params: { portrait: file }
      }.to change { client.reload.portrait.attached? }.from(false).to(true)

      expect(response).to redirect_to(client_url(client, tab: "profile"))
    end
  end

  describe "DELETE /destroy" do
    it "purges the client portrait" do
      client = create(:client)
      client.portrait.attach(
        io: Rails.root.join("spec/fixtures/files/sample.png").open,
        filename: "demo-portrait.png",
        content_type: "image/png",
      )

      expect {
        delete client_portrait_url(client)
      }.to change { client.reload.portrait.attached? }.from(true).to(false)

      expect(response).to redirect_to(client_url(client, tab: "profile"))
    end
  end
end
