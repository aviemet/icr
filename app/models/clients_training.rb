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
class ClientsTraining < ApplicationRecord
  belongs_to :client, inverse_of: :clients_trainings
  belongs_to :training, class_name: "Employee::Training", inverse_of: :clients_trainings

  validates :training_id, uniqueness: { scope: :client_id }

  scope :includes_associated, -> { includes([:client, :training]) }
end
