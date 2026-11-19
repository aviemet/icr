# == Schema Information
#
# Table name: employee_support_contacts
#
#  id           :uuid             not null, primary key
#  is_emergency :boolean          default(FALSE), not null
#  notes        :text
#  priority     :integer          default(1), not null
#  relationship :integer          default("emergency"), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  employee_id  :uuid             not null
#  person_id    :uuid             not null
#
# Indexes
#
#  index_employee_support_contacts_on_employee_id  (employee_id)
#  index_employee_support_contacts_on_person_id    (person_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (person_id => people.id)
#
class Employee::SupportContact < ApplicationRecord
  self.table_name = "employee_support_contacts"

  include Personable

  belongs_to :employee, class_name: "Employee", inverse_of: :support_contacts

  enum :relationship, {
    emergency: 0,
    family: 1,
    other: 2
  }, prefix: true

  validates :priority, numericality: { only_integer: true, greater_than: 0 }

  scope :emergency, -> { where(is_emergency: true) }
  scope :includes_associated, -> { includes(person: { contact: [:phones, :emails, :addresses] }) }
end
