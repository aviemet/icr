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
class Employee::EmployeesJobTitle < ApplicationRecord
  self.table_name = "employees_job_titles"

  resourcify

  belongs_to :employee
  belongs_to :job_title, class_name: "Employee::JobTitle"

  attribute :starts_at, :datetime, default: -> { Time.current }

  enum :application_type, {
    applicant: "applicant",
    new_hire: "new_hire",
    position_change: "position_change",
  }

  enum :offer_status, {
    draft: "draft",
    offered: "offered",
    accepted: "accepted",
    declined: "declined",
    withdrawn: "withdrawn"
  }

  validates :starts_at, presence: true
  validates :application_type, presence: true
  validates :offer_status, presence: true
  validate :ends_at_after_starts_at, if: :ends_at?
  validate :ensure_single_active_title, on: :create

  scope :current, -> { where("starts_at <= ? AND (ends_at IS NULL OR ends_at >= ?)", Time.current, Time.current) }
  scope :future, -> { where("starts_at > ?", Time.current) }
  scope :historical, -> { where(ends_at: ...Time.current) }
  scope :includes_associated, -> { includes([:employee, :job_title]) }

  private

  def ends_at_after_starts_at
    return if ends_at.blank?

    errors.add(:ends_at, "must be after starts_at") if ends_at < starts_at
  end

  def ensure_single_active_title
    return if ends_at.present?

    if employee.employees_job_titles.where(ends_at: nil).where.not(id: id).exists?
      errors.add(:base, "Employee already has an active job title")
    end
  end
end
