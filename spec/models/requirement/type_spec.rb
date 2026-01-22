# == Schema Information
#
# Table name: requirement_types
#
#  id          :uuid             not null, primary key
#  description :text
#  name        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
require "rails_helper"

RSpec.describe Requirement::Type do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:requirement_type)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(name).each do |attr|
        expect(build(:requirement_type, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it { is_expected.to have_many(:requirements).class_name("Requirement::Requirement").dependent(:restrict_with_error) }
  end
end
