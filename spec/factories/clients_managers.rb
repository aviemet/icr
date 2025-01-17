# == Schema Information
#
# Table name: clients_managers
#
#  id         :uuid             not null, primary key
#  ends_at    :date
#  starts_at  :date             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  client_id  :uuid             not null
#  manager_id :uuid             not null
#
# Indexes
#
#  index_clients_managers_on_client_id         (client_id)
#  index_clients_managers_on_manager_id        (manager_id)
#  index_clients_managers_unique_relationship  (manager_id,client_id) UNIQUE WHERE (ends_at IS NULL)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (manager_id => employees.id)
#
FactoryBot.define do
  factory :clients_manager do
    manager { nil }
    client { nil }
    starts_at { "2025-01-16" }
    ends_at { "2025-01-16" }
  end
end
