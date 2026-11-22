require "rails_helper"

RSpec.describe Client::HospitalVisit do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:client_hospital_visit)).to be_valid
    end

    it "requires hospital_name" do
      expect(build(:client_hospital_visit, hospital_name: nil)).not_to be_valid
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:client) }
    it { is_expected.to belong_to(:doctor).optional }
    it { is_expected.to belong_to(:incident_report).optional }
  end
end
