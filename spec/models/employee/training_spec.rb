# == Schema Information
#
# Table name: trainings
#
#  id                :uuid             not null, primary key
#  description       :text
#  estimated_minutes :integer
#  name              :string
#  status            :integer          default("active"), not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
require "rails_helper"

RSpec.describe Employee::Training do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:training)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(name).each do |attr|
        expect(build(:training, attr => nil)).not_to be_valid
      end
    end

    it "rejects negative estimated_minutes" do
      expect(build(:training, estimated_minutes: -1)).not_to be_valid
    end

    it "defaults to active" do
      expect(build(:training).status).to eq("active")
    end
  end

  describe "Associations" do
    it { is_expected.to have_many(:employees_trainings).class_name("Employee::EmployeesTraining").dependent(:destroy) }
    it { is_expected.to have_many(:employees).through(:employees_trainings) }
    it { is_expected.to have_many(:clients_trainings).class_name("ClientsTraining").dependent(:destroy) }
    it { is_expected.to have_many(:clients).through(:clients_trainings) }
    it { is_expected.to have_many(:requirement_items).class_name("Requirement::Item").dependent(:destroy) }
    it { is_expected.to have_many(:requirements).through(:requirement_items).class_name("Requirement::Requirement") }
  end

  describe ".active" do
    it "includes only active trainings" do
      active = create(:training, status: :active)
      create(:training, status: :inactive)

      expect(described_class.active).to contain_exactly(active)
    end
  end
end
