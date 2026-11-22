require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "/clients/:client_slug/doctors" do
  login_user(:admin)

  describe "POST /create" do
    it "links a doctor with notes" do
      client = create(:client)
      doctor = create(:doctor)

      expect {
        post client_doctors_url(client), params: {
          doctor_id: doctor.id,
          notes: "Primary care",
        }
      }.to change(DoctorsClient, :count).by(1)

      expect(response).to redirect_to(client_url(client, tab: "medical"))
      expect(client.doctors_clients.find_by!(doctor_id: doctor.id).notes).to eq("Primary care")
    end
  end

  describe "DELETE /destroy" do
    it "unlinks the doctor" do
      client = create(:client)
      doctor = create(:doctor)
      client.doctors << doctor

      expect {
        delete client_doctor_url(client, doctor)
      }.to change(DoctorsClient, :count).by(-1)

      expect(response).to redirect_to(client_url(client, tab: "medical"))
    end
  end
end
