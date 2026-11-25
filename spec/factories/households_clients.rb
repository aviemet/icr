# == Schema Information
#
# Table name: households_clients
#
#  id           :uuid             not null, primary key
#  ends_at      :date
#  starts_at    :date             not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  client_id    :uuid             not null
#  household_id :uuid             not null
#
# Indexes
#
#  index_households_clients_on_client_id         (client_id)
#  index_households_clients_on_household_id      (household_id)
#  index_households_clients_one_open_per_client  (client_id) UNIQUE WHERE (ends_at IS NULL)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (household_id => households.id)
#
FactoryBot.define do
  factory :households_client do
    household
    client
    starts_at { Date.current }

    trait :ended do
      starts_at { 30.days.ago.to_date }
      ends_at { 1.day.ago.to_date }
    end
  end
end
