# == Schema Information
#
# Table name: job_titles
#
#  id          :uuid             not null, primary key
#  description :text
#  name        :string           not null
#  slug        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_job_titles_on_slug  (slug) UNIQUE
#
require "rails_helper"

RSpec.describe JobTitle do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:job_title)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(name).each do |attr|
        expect(build(:job_title, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it{ is_expected.to have_many(:employees).through(:employees_job_titles) }
    it{ is_expected.to have_many(:active_employees_job_titles) }
    it{ is_expected.to have_many(:active_employees).through(:active_employees_job_titles) }
  end
end
