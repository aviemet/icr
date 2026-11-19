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
class Employee::CredentialSerializer < ApplicationSerializer
  object_as :credential, model: "Employee::Credential"

  attributes(
    :employee_id,
    :name,
    :credential_type,
    :number,
    :issued_on,
    :expires_on,
    :notes,
  )
end
