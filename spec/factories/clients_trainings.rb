# == Schema Information
#
# Table name: clients_trainings
#
#  id          :uuid             not null, primary key
#  required    :boolean          default(FALSE), not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  client_id   :uuid             not null
#  training_id :uuid             not null
#
# Indexes
#
#  index_clients_trainings_on_client_id                  (client_id)
#  index_clients_trainings_on_client_id_and_training_id  (client_id,training_id) UNIQUE
#  index_clients_trainings_on_training_id                (training_id)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (training_id => trainings.id)
#
FactoryBot.define do
  factory :clients_training do
    client
    training
    required { false }
  end
end
