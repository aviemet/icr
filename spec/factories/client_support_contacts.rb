# == Schema Information
#
# Table name: client_support_contacts
#
#  id           :uuid             not null, primary key
#  is_emergency :boolean          default(FALSE), not null
#  notes        :text
#  priority     :integer          default(1), not null
#  relationship :integer          default("emergency"), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  client_id    :uuid             not null
#  person_id    :uuid             not null
#
# Indexes
#
#  index_client_support_contacts_on_client_id  (client_id)
#  index_client_support_contacts_on_person_id  (person_id)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (person_id => people.id)
#
FactoryBot.define do
  factory :client_support_contact, class: "Client::SupportContact" do
    client
    person
    relationship { :emergency }
    priority { 1 }
    is_emergency { true }
  end
end
