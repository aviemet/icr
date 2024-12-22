# == Schema Information
#
# Table name: employees_job_titles
#
#  id           :uuid             not null, primary key
#  ends_at      :date
#  starts_at    :date             not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  employee_id  :uuid             not null
#  job_title_id :uuid             not null
#
# Indexes
#
#  index_employees_job_titles_on_employee_id   (employee_id)
#  index_employees_job_titles_on_job_title_id  (job_title_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (job_title_id => job_titles.id)
#
require "rails_helper"

RSpec.describe EmployeesJobTitle do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:employees_job_title)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(starts_at).each do |attr|
        expect(build(:employees_job_title, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it{ is_expected.to belong_to(:employee) }
    it{ is_expected.to belong_to(:job_title) }
  end
end
