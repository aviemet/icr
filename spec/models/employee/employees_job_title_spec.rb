# == Schema Information
#
# Table name: employees_job_titles
#
#  id                     :uuid             not null, primary key
#  application_type       :integer
#  ends_at                :datetime
#  offer_status           :integer
#  proposed_salary_period :integer
#  proposed_start_date    :date
#  starts_at              :datetime
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  employee_id            :uuid             not null
#  job_title_id           :uuid             not null
#  proposed_pay_rate_id   :bigint
#
# Indexes
#
#  index_employees_job_titles_on_employee_id           (employee_id)
#  index_employees_job_titles_on_job_title_id          (job_title_id)
#  index_employees_job_titles_on_proposed_pay_rate_id  (proposed_pay_rate_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (job_title_id => job_titles.id)
#
require "rails_helper"

RSpec.describe Employee::EmployeesJobTitle do
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
