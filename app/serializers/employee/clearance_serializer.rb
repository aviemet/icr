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
class Employee::ClearanceSerializer < ApplicationSerializer
  object_as :clearance, model: "Employee::Clearance"

  attributes(
    :employee_id,
    :clearance_type,
    :status,
    :cleared_on,
    :expires_on,
    :notes,
  )
end
