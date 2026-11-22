require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "/clients/:client_slug/allergies" do
  login_user(:admin)

  describe "POST /create" do
    it "creates an allergy for the client" do
      client = create(:client)

      expect {
        post client_allergies_url(client), params: {
          allergy: { name: "Peanuts", severity: "severe", reaction: "Anaphylaxis", active: true },
        }
      }.to change(Client::Allergy, :count).by(1)

      expect(response).to redirect_to(client_url(client, tab: "medical"))
      expect(client.allergies.last.name).to eq("Peanuts")
    end
  end

  describe "DELETE /destroy" do
    it "destroys the allergy" do
      client = create(:client)
      allergy = create(:client_allergy, client: client)

      expect {
        delete client_allergy_url(client, allergy)
      }.to change(Client::Allergy, :count).by(-1)

      expect(response).to redirect_to(client_url(client, tab: "medical"))
    end
  end
end
