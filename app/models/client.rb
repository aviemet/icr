# == Schema Information
#
# Table name: clients
#
#  id          :bigint           not null, primary key
#  active_at   :date
#  inactive_at :date
#  number      :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  person_id   :bigint           not null
#
# Indexes
#
#  index_clients_on_person_id  (person_id)
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#
class Client < ApplicationRecord
  include Identificationable

  pg_search_scope(
    :search,
    against: [:person, :active_at, :inactive_at, :number],
    associated_against: {
      person: [],
    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify

  belongs_to :person

  has_many :doctors_clients, dependent: :nullify
  has_many :doctors, through: :doctors_clients

  has_many :households_clients, dependent: :nullify
  has_one :household, through: :households_clients, dependent: :nullify

  accepts_nested_attributes_for :person

  scope :includes_associated, -> { includes([:person, :identifications]) }
end
