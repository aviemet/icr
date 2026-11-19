# == Schema Information
#
# Table name: client_allergies
#
#  id         :uuid             not null, primary key
#  active     :boolean          default(TRUE), not null
#  name       :string           not null
#  notes      :text
#  reaction   :string
#  severity   :integer          default("mild"), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  client_id  :uuid             not null
#
# Indexes
#
#  index_client_allergies_on_client_id  (client_id)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#
FactoryBot.define do
  factory :client_allergy, class: "Client::Allergy" do
    client
    name { "Penicillin" }
    severity { :moderate }
    reaction { "Rash" }
    active { true }
  end
end
