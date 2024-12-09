# == Schema Information
#
# Table name: households_clients
#
#  id           :uuid             not null, primary key
#  ends_at      :date
#  starts_at    :date
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  client_id    :uuid             not null
#  household_id :uuid             not null
#
# Indexes
#
#  index_households_clients_on_client_id     (client_id)
#  index_households_clients_on_household_id  (household_id)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (household_id => households.id)
#
require 'rails_helper'

RSpec.describe HouseholdsClient, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
