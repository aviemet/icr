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
class ClientsAttendant < ApplicationRecord
  belongs_to :attendant, class_name: "Employee"
  belongs_to :client

  attribute :starts_at, :datetime, default: -> { Time.current }

  validates :starts_at, presence: true
  validate :ends_at_after_starts_at, if: :ends_at?

  validates :attendant_id, uniqueness: {
    scope: :client_id,
    conditions: -> { where(ends_at: nil) },
    message: "already attends this client"
  }

  scope :current, -> { where("starts_at <= ? AND (ends_at IS NULL OR ends_at >= ?)", Time.current, Time.current) }

  scope :includes_associated, -> { includes([:attendant, :client]) }

  private

  def ends_at_after_starts_at
    return if ends_at.blank?

    if ends_at < starts_at
      errors.add(:ends_at, "must be after starts_at")
    end
  end
end
