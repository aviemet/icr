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
class EmployeesJobTitle < ApplicationRecord
  resourcify

  belongs_to :employee
  belongs_to :job_title

  validates :starts_at, presence: true
end
