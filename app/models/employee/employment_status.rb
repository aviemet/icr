# == Schema Information
#
# Table name: employment_statuses
#
#  id            :uuid             not null, primary key
#  active_at     :datetime
#  inactive_at   :datetime
#  name          :string
#  notes         :text
#  order         :integer
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  employee_id   :uuid             not null
#  updated_by_id :uuid             not null
#
# Indexes
#
#  index_employment_statuses_on_employee_id    (employee_id)
#  index_employment_statuses_on_updated_by_id  (updated_by_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (updated_by_id => users.id)
#
class Employee::EmploymentStatus < ApplicationRecord
  self.table_name = "employment_statuses"

  include Categorizable

  include PgSearchable
  pg_search_config(
    against: [:name, :active_at, :inactive_at, :notes, :category, :order],
    associated_against: {
      employee: [:number],
      category: [:name],
    },
  )

  tracked
  resourcify

  belongs_to :employee
  belongs_to :updated_by, class_name: "Person"

  scope :includes_associated, -> { includes([:employee, :updated_by, :category]) }
end
