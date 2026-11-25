# == Schema Information
#
# Table name: households_clients
#
#  id           :uuid             not null, primary key
#  ends_at      :date
#  starts_at    :date             not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  client_id    :uuid             not null
#  household_id :uuid             not null
#
# Indexes
#
#  index_households_clients_on_client_id         (client_id)
#  index_households_clients_on_household_id      (household_id)
#  index_households_clients_one_open_per_client  (client_id) UNIQUE WHERE (ends_at IS NULL)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (household_id => households.id)
#
class HouseholdsClient < ApplicationRecord
  resourcify

  belongs_to :household
  belongs_to :client

  attribute :starts_at, :date, default: -> { Date.current }

  validates :starts_at, presence: true
  validate :ends_at_after_starts_at, if: :ends_at?
  validate :no_overlapping_memberships
  validates :client_id, uniqueness: {
    conditions: -> { where(ends_at: nil) },
    message: :already_member,
  }

  scope :current, -> {
    where("starts_at <= ? AND (ends_at IS NULL OR ends_at >= ?)", Date.current, Date.current)
  }
  scope :historical, -> { where(ends_at: ...Date.current) }
  scope :overlapping, ->(range_start, range_end) {
    start_date = range_start.to_date
    end_date = range_end.to_date
    where("starts_at <= ? AND (ends_at IS NULL OR ends_at >= ?)", end_date, start_date)
  }
  scope :includes_associated, -> { includes([:household, { client: :person }]) }

  def covers?(day)
    date = day.to_date
    return false if starts_at > date
    return true if ends_at.blank?

    ends_at >= date
  end

  private

  def ends_at_after_starts_at
    return if ends_at.blank? || starts_at.blank?

    if ends_at < starts_at
      errors.add(:ends_at, "must be after starts_at")
    end
  end

  def no_overlapping_memberships
    return if client_id.blank? || starts_at.blank?

    end_bound = ends_at || Date.new(9999, 12, 31)
    conflicting = HouseholdsClient
      .where(client_id: client_id)
      .where.not(id: id)
      .where(starts_at: ..end_bound)
      .where("ends_at IS NULL OR ends_at >= ?", starts_at)

    return unless conflicting.exists?

    errors.add(:base, :overlapping_membership)
  end
end
