# frozen_string_literal: true

# == Schema Information
#
# Table name: shift_occurrence_approvals
#
#  id                      :uuid             not null, primary key
#  facilitator_approved_at :datetime         not null
#  occurrence_starts_at    :datetime         not null
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  shift_id                :uuid             not null
#
# Indexes
#
#  index_shift_occurrence_approvals_on_shift_id  (shift_id)
#  index_shift_occurrence_approvals_uniqueness   (shift_id,occurrence_starts_at) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (shift_id => shifts.id)
#
class ShiftOccurrenceApproval < ApplicationRecord
  belongs_to :shift

  validates :occurrence_starts_at, presence: true
  validates :facilitator_approved_at, presence: true
  validates :occurrence_starts_at, uniqueness: { scope: :shift_id }

  def self.normalize_occurrence_starts_at(value)
    time = value
    time = Time.zone.parse(time.to_s) unless time.acts_like?(:time)
    time.utc.change(usec: (time.usec / 1000) * 1000)
  end

  def self.lookup_key(shift_id, occurrence_starts_at)
    [
      shift_id.to_s,
      normalize_occurrence_starts_at(occurrence_starts_at).iso8601(3),
    ]
  end

  def self.approve!(shift:, occurrence_starts_at:)
    slot = normalize_occurrence_starts_at(occurrence_starts_at)
    row = find_or_initialize_by(shift_id: shift.id, occurrence_starts_at: slot)
    row.facilitator_approved_at = Time.current
    row.save!
    row
  end

  def self.unapprove!(shift:, occurrence_starts_at:)
    slot = normalize_occurrence_starts_at(occurrence_starts_at)
    where(shift_id: shift.id, occurrence_starts_at: slot).delete_all
  end

  def self.map_for_shift_ids(shift_ids)
    where(shift_id: shift_ids).each_with_object({}) do |row, hash|
      hash[lookup_key(row.shift_id, row.occurrence_starts_at)] = row
    end
  end
end
