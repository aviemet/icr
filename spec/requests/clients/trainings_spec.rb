require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Clients::Trainings" do
  login_user(:admin)

  let(:client) { create(:client) }
  let(:training) { create(:training) }

  describe "POST /create" do
    it "associates a training with the client" do
      expect {
        post client_trainings_url(client), params: {
          clients_training: {
            training_id: training.id,
            required: true,
          },
        }
      }.to change(ClientsTraining, :count).by(1)

      expect(response).to redirect_to(client_url(client, tab: "trainings"))
      row = ClientsTraining.last
      expect(row.client).to eq(client)
      expect(row.training).to eq(training)
      expect(row.required).to be(true)
    end
  end

  describe "PUT /update" do
    it "toggles required" do
      row = create(:clients_training, client: client, training: training, required: false)

      put client_training_url(client, row), params: {
        clients_training: { required: true },
      }

      expect(response).to redirect_to(client_url(client, tab: "trainings"))
      expect(row.reload.required).to be(true)
    end
  end

  describe "DELETE /destroy" do
    it "removes the association" do
      row = create(:clients_training, client: client, training: training)
      expect {
        delete client_training_url(client, row)
      }.to change(ClientsTraining, :count).by(-1)
      expect(response).to redirect_to(client_url(client, tab: "trainings"))
    end
  end
end
