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
class Client::Allergy < ApplicationRecord
  self.table_name = "client_allergies"

  belongs_to :client

  enum :severity, {
    mild: 0,
    moderate: 1,
    severe: 2,
    life_threatening: 3
  }, prefix: true

  validates :name, presence: true

  scope :active, -> { where(active: true) }
  scope :includes_associated, -> { includes(:client) }
end
