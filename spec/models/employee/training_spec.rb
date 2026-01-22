# == Schema Information
#
# Table name: trainings
#
#  id                :uuid             not null, primary key
#  active_on         :datetime
#  description       :text
#  estimated_minutes :integer
#  inactive_on       :datetime
#  name              :string
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
  end

  describe "Associations" do
    it { is_expected.to have_many(:employees_trainings).class_name("Employee::EmployeesTraining").dependent(:destroy) }
    it { is_expected.to have_many(:employees).through(:employees_trainings) }
    it { is_expected.to have_many(:requirement_items).class_name("Requirement::Item").dependent(:destroy) }
    it { is_expected.to have_many(:requirements).through(:requirement_items).class_name("Requirement::Requirement") }
  end
end
