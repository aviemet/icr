require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "/clients/:client_slug/hospital_visits" do
  login_user(:admin)

  describe "POST /create" do
    it "creates a hospital visit for the client" do
      client = create(:client)
      doctor = create(:doctor)
      incident = create(:incident_report, client: client)

      expect {
        post client_hospital_visits_url(client), params: {
          hospital_visit: {
            hospital_name: "County General",
            doctor_id: doctor.id,
            incident_report_id: incident.id,
            admitted_at: Time.current,
            reason: "Fall evaluation",
            notes: "Overnight observation",
          },
        }
      }.to change(Client::HospitalVisit, :count).by(1)

      expect(response).to redirect_to(client_url(client, tab: "medical"))
      visit = client.hospital_visits.last
      expect(visit.hospital_name).to eq("County General")
      expect(visit.doctor_id).to eq(doctor.id)
      expect(visit.incident_report_id).to eq(incident.id)
    end
  end

  describe "DELETE /destroy" do
    it "destroys the hospital visit" do
      client = create(:client)
      visit = create(:client_hospital_visit, client: client)

      expect {
        delete client_hospital_visit_url(client, visit)
      }.to change(Client::HospitalVisit, :count).by(-1)

      expect(response).to redirect_to(client_url(client, tab: "medical"))
    end
  end
end
