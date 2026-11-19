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
FactoryBot.define do
  factory :employee_credential, class: "Employee::Credential" do
    employee
    name { "CPR Certification" }
    credential_type { :cpr }
    number { "CPR-123" }
    issued_on { Date.current - 30.days }
    expires_on { Date.current + 60.days }
    notes { nil }
  end
end
