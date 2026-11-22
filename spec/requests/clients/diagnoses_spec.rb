require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "/clients/:client_slug/diagnoses" do
  login_user(:admin)

  describe "POST /create" do
    it "creates a diagnosis with an optional doctor" do
      client = create(:client)
      doctor = create(:doctor)

      expect {
        post client_diagnoses_url(client), params: {
          diagnosis: {
            name: "Hypertension",
            code: "I10",
            doctor_id: doctor.id,
            active: true,
          },
        }
      }.to change(Client::Diagnosis, :count).by(1)

      expect(response).to redirect_to(client_url(client, tab: "medical"))
      diagnosis = client.diagnoses.last
      expect(diagnosis.name).to eq("Hypertension")
      expect(diagnosis.doctor_id).to eq(doctor.id)
    end
  end
end
