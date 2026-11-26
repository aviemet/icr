require "rails_helper"

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
RSpec.describe Employee::SupportContact do
  subject(:support_contact) { build(:employee_support_contact) }

  it { is_expected.to validate_numericality_of(:priority).only_integer.is_greater_than(0) }

  it "persists with emergency relationship" do
    support_contact.save!
    expect(support_contact).to be_relationship_emergency
    expect(support_contact.is_emergency).to be(true)
  end
end
