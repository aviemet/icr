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

    it "only returns active job title assignments" do
      job_title = create(:job_title)
      today = Date.current

      # Current/Active assignment
      create(:employees_job_title,
        job_title: job_title,
        starts_at: today - 1.day,
        ends_at: nil,)

      # Future assignment (shouldn't be included)
      create(:employees_job_title,
        job_title: job_title,
        starts_at: today + 1.day,
        ends_at: nil,)

      # Past assignment (shouldn't be included)
      create(:employees_job_title,
        job_title: job_title,
        starts_at: today - 2.days,
        ends_at: today - 1.day,)

      # Current assignment with future end date
      create(:employees_job_title,
        job_title: job_title,
        starts_at: today - 1.day,
        ends_at: today + 1.day,)

      expect(job_title.active_employees_job_titles.count).to eq(2)

      job_title.active_employees_job_titles.each do |assignment|
        expect(assignment.starts_at).to be <= today
        expect(assignment.ends_at).to be_nil.or be >= today
      end
    end
  end

end
