# == Schema Information
#
# Table name: employee_credentials
#
#  id              :uuid             not null, primary key
#  credential_type :integer          default("cpr"), not null
#  expires_on      :date
#  issued_on       :date
#  name            :string           not null
#  notes           :text
#  number          :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  employee_id     :uuid             not null
#
# Indexes
#
#  index_employee_credentials_on_employee_id  (employee_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#
class Employee::Credential < ApplicationRecord
  self.table_name = "employee_credentials"

  belongs_to :employee, class_name: "Employee", inverse_of: :credentials

  enum :credential_type, {
    cpr: 0,
    first_aid: 1,
    drivers_license: 2,
    professional_license: 3,
    other: 4
  }, prefix: true

  validates :name, presence: true
  validates :credential_type, presence: true

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
