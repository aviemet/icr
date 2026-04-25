# == Schema Information
#
# Table name: households
#
#  id         :uuid             not null, primary key
#  name       :string           not null
#  slug       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_households_on_slug  (slug) UNIQUE
#
class Household < ApplicationRecord
  include Contactable
  include Participantable

  extend FriendlyId

  friendly_id :name, use: [:slugged, :history]

  include PgSearchable

  pg_search_config(against: [:name],
  associated_against: {
    clients: [:number, :slug],
    people: [:first_name, :middle_name, :last_name]
  },)

  has_many :households_clients, dependent: :nullify
  has_many :clients, through: :households_clients, dependent: :nullify
  has_many :people, through: :clients, source: :person

  validates :name, presence: true

  def schedule_events_between(start_time, end_time)
    calendar_event_ids = Calendar::Event
      .joins(:clients)
      .where(clients: { id: clients.select(:id) })
      .distinct
      .select(:id)

    Calendar::Event
      .where(id: calendar_event_ids)
      .with_schedule_association_preloads
      .between(start_time, end_time)
  end
end
