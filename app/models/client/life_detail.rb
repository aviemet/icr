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
class Client::LifeDetail < ApplicationRecord
  self.table_name = "client_life_details"

  belongs_to :client

  validates :client_id, uniqueness: true
end
