class ClientsManager < ApplicationRecord
  belongs_to :manager, class_name: "Employee"
  belongs_to :client

  validates :starts_at, presence: true
  validates :manager_id, uniqueness: {
    scope: :client_id,
    conditions: -> { where(ends_at: nil) },
    message: "already manages this client"
  }

  validate :manager_can_manage_clients

  private

  def manager_can_manage_clients
    unless manager&.can_manage_clients?
      errors.add(:manager, "must have client management privileges")
    end
  end
end
