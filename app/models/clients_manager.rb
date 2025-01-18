# == Schema Information
#
# Table name: clients_managers
#
#  id         :uuid             not null, primary key
#  ends_at    :datetime
#  starts_at  :datetime         not null
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
class ClientsManager < ApplicationRecord
  belongs_to :manager, class_name: "Employee"
  belongs_to :client

  attribute :starts_at, :datetime, default: -> { Time.current }

  validates :starts_at, presence: true
  validate :ends_at_after_starts_at, if: :ends_at?

  validates :manager_id, uniqueness: {
    scope: :client_id,
    conditions: -> { where(ends_at: nil) },
    message: "already manages this client"
  }

  scope :current, -> { where("starts_at <= ? AND (ends_at IS NULL OR ends_at >= ?)", Time.current, Time.current) }

  scope :includes_associated, -> { includes([:manager, :client]) }

  private

  def ends_at_after_starts_at
    return if ends_at.blank?

    if ends_at < starts_at
      errors.add(:ends_at, "must be after starts_at")
    end
  end
end
