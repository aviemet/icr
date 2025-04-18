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
FactoryBot.define do
  factory :employees_job_title do
    starts_at { 6.months.ago }

    employee
    job_title
  end
end
