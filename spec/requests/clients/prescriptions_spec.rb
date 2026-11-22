require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "/clients/:client_slug/prescriptions" do
  login_user(:admin)

  describe "POST /create" do
    it "creates a prescription with nested dosage and medication" do
      client = create(:client)
      doctor = create(:doctor)
      client.doctors << doctor

      expect {
        post client_prescriptions_url(client), params: {
          prescription: {
            doctor_id: doctor.id,
            starts_at: Date.current,
            medication_attributes: { name: "Lisinopril", generic_name: "lisinopril" },
            dosage_attributes: {
              amount: 10,
              amount_unit: "mg",
              freq_amount: 1,
              freq_period: "day",
            },
          },
        }
      }.to change(Prescription, :count).by(1)
        .and change(Medication, :count).by(1)
        .and change(Dosage, :count).by(1)

      expect(response).to redirect_to(client_url(client, tab: "medical"))
      prescription = client.prescriptions.last
      expect(prescription.medication.name).to eq("Lisinopril")
      expect(prescription.dosage.amount).to eq(10)
    end

    it "stores administration_method on the nested dosage" do
      client = create(:client)
      doctor = create(:doctor)
      client.doctors << doctor

      post client_prescriptions_url(client), params: {
        prescription: {
          doctor_id: doctor.id,
          starts_at: Date.current,
          medication_attributes: { name: "Insulin" },
          dosage_attributes: {
            amount: 5,
            amount_unit: "unit",
            freq_amount: 1,
            freq_period: "day",
            administration_method: "injection",
          },
        },
      }

      expect(response).to redirect_to(client_url(client, tab: "medical"))
      expect(client.prescriptions.last.dosage.administration_method).to eq("injection")
    end
  end
end
