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
class Client::LifeDetailSerializer < ApplicationSerializer
  object_as :life_detail, model: "Client::LifeDetail"

  attributes(
    :client_id,
    :adls,
    :adaptive_supports,
    :behavior_supports,
    :routines,
    :risk_flags,
  )
end
