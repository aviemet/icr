# == Schema Information
#
# Table name: client_support_contacts
#
#  id           :uuid             not null, primary key
#  is_emergency :boolean          default(FALSE), not null
#  notes        :text
#  priority     :integer          default(1), not null
#  relationship :integer          default("emergency"), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  client_id    :uuid             not null
#  person_id    :uuid             not null
#
# Indexes
#
#  index_client_support_contacts_on_client_id  (client_id)
#  index_client_support_contacts_on_person_id  (person_id)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (person_id => people.id)
#
class Client::SupportContact < ApplicationRecord
  self.table_name = "client_support_contacts"

  include Personable

  belongs_to :client

  enum :relationship, {
    emergency: 0,
    family: 1,
    guardian: 2,
    conservator: 3,
    authorized_rep: 4,
    other: 5
  }, prefix: true

  validates :priority, numericality: { only_integer: true, greater_than: 0 }

  scope :emergency, -> { where(is_emergency: true) }
  scope :includes_associated, -> { includes(person: { contact: [:phones, :emails, :addresses] }) }
end
