# == Schema Information
#
# Table name: clients_attendants
#
#  id           :uuid             not null, primary key
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
#  index_clients_attendants_unique_relationship  (attendant_id,client_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (attendant_id => employees.id)
#  fk_rails_...  (client_id => clients.id)
#
class ClientsAttendant < ApplicationRecord
  belongs_to :attendant, class_name: "Employee"
  belongs_to :client, inverse_of: :clients_attendants

  attribute :starts_at, :datetime, default: -> { Time.current }

  validates :starts_at, presence: true

  validates :attendant_id, uniqueness: {
    scope: :client_id,
    message: :already_attends
  }

  validate :requirement_gates_for_assignment, if: -> { new_record? || client_id_changed? }

  scope :current, -> { where(starts_at: ..Time.current) }

  scope :includes_associated, -> { includes([:attendant, :client]) }

  private

  def requirement_gates_for_assignment
    return if attendant.blank? || client.blank?

    gate = Requirement::ClientScheduleGate.call(employee: attendant, client: client)
    return if gate.allowed?

    errors.add(
      :base,
      I18n.t(
        "requirements.gates.client_schedule_blocked",
        employee: attendant.name,
        client: client.name,
        names: gate.unmet_names.to_sentence,
      ),
    )
  end
end
