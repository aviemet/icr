# == Schema Information
#
# Table name: employees_job_titles
#
#  id           :uuid             not null, primary key
#  ends_at      :datetime
#  starts_at    :datetime         not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  employee_id  :uuid             not null
#  job_title_id :uuid             not null
#
# Indexes
#
#  index_employees_job_titles_on_employee_id   (employee_id)
#  index_employees_job_titles_on_job_title_id  (job_title_id)
#  index_ensure_single_active_job_title        (employee_id,starts_at,ends_at) UNIQUE WHERE (ends_at IS NULL)
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

  attribute :starts_at, :datetime, default: -> { Time.current }

  validates :starts_at, presence: true
  validate :ends_at_after_starts_at, if: :ends_at?

  scope :current, -> { where("starts_at <= ? AND (ends_at IS NULL OR ends_at >= ?)", Time.current, Time.current) }

  scope :includes_associated, -> { includes([:employee, :job_title]) }

  private

  def ends_at_after_starts_at
    return if ends_at.blank?

    if ends_at < starts_at
      errors.add(:ends_at, "must be after starts_at")
    end
  end

end
