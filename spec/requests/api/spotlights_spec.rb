require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Api::Spotlights", type: :request do
  login_user(:admin)

  describe "GET /index" do
    it "returns an empty array by default" do
      get api_spotlights_url
      expect(response).to be_successful

      json = response.parsed_body
      expect(json).to eq([])
    end

    it "returns matching employees and clients for a query" do
      employee_person = create(:person, first_name: "Spotlight", last_name: "Employee")
      client_person = create(:person, first_name: "Spotlight", last_name: "Client")
      other_person = create(:person, first_name: "Other", last_name: "Person")

      employee = create(:employee, person: employee_person)
      client = create(:client, person: client_person)
      other_client = create(:client, person: other_person)

      get api_spotlights_url, params: { q: "Spotlight" }
      expect(response).to be_successful

      json = response.parsed_body
      types_and_slugs = json.map { |item| [item["type"], item["slug"]] }

      expect(types_and_slugs).to include(["employee", employee.slug], ["client", client.slug])
      expect(types_and_slugs).not_to include(["client", other_client.slug])
    end

    it "returns trainings, doctors, households and vendors for a matching query" do
      training = create(:training, name: "Spotlight Safety Training")
      doctor_person = create(:person, first_name: "Spotlight", last_name: "Doctor")
      household = create(:household, name: "Spotlight Household")
      vendor = create(:vendor, name: "Spotlight Vendor")

      create(:doctor, person: doctor_person)

      get api_spotlights_url, params: { q: "Spotlight" }
      expect(response).to be_successful

      json = response.parsed_body

      types = json.pluck("type")
      training_ids = json.select { |item| item["type"] == "training" }.pluck("id")
      doctor_slugs = json.select { |item| item["type"] == "doctor" }.pluck("slug")
      household_slugs = json.select { |item| item["type"] == "household" }.pluck("slug")
      vendor_slugs = json.select { |item| item["type"] == "vendor" }.pluck("slug")

      expect(types).to include("training", "doctor", "household", "vendor")
      expect(training_ids).to include(training.id)
      expect(doctor_slugs).to include(Doctor.last.slug)
      expect(household_slugs).to include(household.slug)
      expect(vendor_slugs).to include(vendor.slug)
    end
  end
end
