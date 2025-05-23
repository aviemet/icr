# == Schema Information
#
# Table name: clients_attendants
#
#  id           :uuid             not null, primary key
#  ends_at      :datetime
#  starts_at    :datetime
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  attendant_id :uuid             not null
#  client_id    :uuid             not null
#
# Indexes
#
#  index_clients_attendants_on_attendant_id      (attendant_id)
#  index_clients_attendants_on_client_id         (client_id)
#  index_clients_attendants_unique_relationship  (attendant_id,client_id) UNIQUE WHERE (ends_at IS NULL)
#
# Foreign Keys
#
#  fk_rails_...  (attendant_id => employees.id)
#  fk_rails_...  (client_id => clients.id)
#
FactoryBot.define do
  factory :clients_attendant do
    attendant factory: :employee
    client
    starts_at { Time.current }
    ends_at { nil }
  end
end
