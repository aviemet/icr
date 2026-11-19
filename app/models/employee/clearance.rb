# == Schema Information
#
# Table name: employee_clearances
#
#  id             :uuid             not null, primary key
#  clearance_type :integer          default("tb"), not null
#  cleared_on     :date
#  expires_on     :date
#  notes          :text
#  status         :integer          default("pending"), not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  employee_id    :uuid             not null
#
# Indexes
#
#  index_employee_clearances_on_employee_id  (employee_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#
class Employee::Clearance < ApplicationRecord
  self.table_name = "employee_clearances"

  belongs_to :employee, class_name: "Employee", inverse_of: :clearances

  enum :clearance_type, {
    tb: 0,
    physical: 1,
    other: 2
  }, prefix: true

  enum :status, {
    pending: 0,
    cleared: 1,
    expired: 2
  }, prefix: true

  validates :clearance_type, presence: true
  validates :status, presence: true

  scope :expiring_soon, -> {
    where(expires_on: Date.current..(Date.current + 30.days))
  }

  def expiring_soon?
    expires_on.present? && expires_on <= Date.current + 30.days && expires_on >= Date.current
  end

  def expired?
    expires_on.present? && expires_on < Date.current
  end
end
