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

  resourcify

  has_many :households_clients, dependent: :destroy, inverse_of: :household
  has_many :current_households_clients, -> {
    merge(HouseholdsClient.current)
  }, class_name: "HouseholdsClient", dependent: nil, inverse_of: :household
  has_many :current_memberships, -> {
    merge(HouseholdsClient.current)
  }, class_name: "HouseholdsClient", dependent: nil, inverse_of: :household
  has_many :past_memberships, -> {
    merge(HouseholdsClient.historical).order(ends_at: :desc)
  }, class_name: "HouseholdsClient", dependent: nil, inverse_of: :household
  has_many :clients, through: :current_households_clients
  has_many :people, through: :clients, source: :person
  has_many :compliance_form_submissions,
    class_name: "Compliance::FormSubmission",
    dependent: :nullify,
    inverse_of: :household

  validates :name, presence: true

  scope :includes_associated, -> {
    includes(
      :clients,
      contact: { addresses: :category, emails: :category, phones: :category },
      current_households_clients: { client: :person },
    )
  }

  scope :includes_show, -> {
    includes_associated.includes(
      households_clients: { client: :person },
      current_memberships: { client: :person },
      past_memberships: { client: :person },
    )
  }

  def schedule_events_between(start_time, end_time)
    membership_client_ids = households_clients
      .overlapping(start_time, end_time)
      .select(:client_id)

    calendar_event_ids = Calendar::Event
      .joins(:clients)
      .where(clients: { id: membership_client_ids })
      .distinct
      .for_schedule_range(start_time, end_time)
      .reselect("calendar_events.id")

    Calendar::Event.where(id: calendar_event_ids).with_schedule_association_preloads
  end

  def membership_windows_overlapping(start_time, end_time)
    households_clients.overlapping(start_time, end_time).to_a
  end
end
