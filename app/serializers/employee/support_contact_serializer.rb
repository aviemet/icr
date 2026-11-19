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
class Employee::SupportContactSerializer < ApplicationSerializer
  object_as :support_contact, model: "Employee::SupportContact"

  attributes(
    :employee_id,
    :relationship,
    :priority,
    :is_emergency,
    :notes,
  )

  type :string, optional: false
  delegate :name, to: :@object
end
