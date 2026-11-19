# == Schema Information
#
# Table name: client_life_details
#
#  id                :uuid             not null, primary key
#  adaptive_supports :text
#  adls              :text
#  behavior_supports :text
#  risk_flags        :text
#  routines          :text
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  client_id         :uuid             not null
#
# Indexes
#
#  index_client_life_details_on_client_id  (client_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#
FactoryBot.define do
  factory :client_life_detail, class: "Client::LifeDetail" do
    client
    adls { "Needs support with meal prep" }
    adaptive_supports { "Uses visual schedules" }
    behavior_supports { "Redirect when escalated" }
    routines { "Morning coffee, evening walk" }
    risk_flags { "Elopement risk in unfamiliar settings" }
  end
end
