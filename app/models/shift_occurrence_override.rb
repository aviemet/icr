# frozen_string_literal: true

# == Schema Information
#
# Table name: shift_occurrence_overrides
#
#  id                   :uuid             not null, primary key
#  ihss                 :boolean
#  occurrence_starts_at :datetime         not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  service_type_id      :uuid
#  shift_id             :uuid             not null
#
# Indexes
#
#  index_shift_occurrence_overrides_on_service_type_id  (service_type_id)
#  index_shift_occurrence_overrides_on_shift_id         (shift_id)
#  index_shift_occurrence_overrides_uniqueness          (shift_id,occurrence_starts_at) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (service_type_id => service_types.id)
#  fk_rails_...  (shift_id => shifts.id)
#
class ShiftOccurrenceOverride < ApplicationRecord
  belongs_to :shift
  belongs_to :service_type, optional: true

  validates :occurrence_starts_at, presence: true
  validates :occurrence_starts_at, uniqueness: { scope: :shift_id }

  def self.normalize_occurrence_starts_at(value)
    ShiftOccurrenceApproval.normalize_occurrence_starts_at(value)
  end

  def self.lookup_key(shift_id, occurrence_starts_at)
    [
      shift_id.to_s,
      normalize_occurrence_starts_at(occurrence_starts_at).iso8601(3),
    ]
  end

  def self.set_ihss!(shift:, occurrence_starts_at:, ihss:)
    slot = normalize_occurrence_starts_at(occurrence_starts_at)
    row = find_or_initialize_by(shift_id: shift.id, occurrence_starts_at: slot)
    row.ihss = ActiveModel::Type::Boolean.new.cast(ihss)
    prune_or_save!(row)
  end

  def self.set_service_type!(shift:, occurrence_starts_at:, service_type:)
    slot = normalize_occurrence_starts_at(occurrence_starts_at)
    row = find_or_initialize_by(shift_id: shift.id, occurrence_starts_at: slot)
    row.service_type = service_type
    prune_or_save!(row)
  end

  def self.map_for_shift_ids(shift_ids)
    where(shift_id: shift_ids).includes(:service_type).each_with_object({}) do |row, hash|
      hash[lookup_key(row.shift_id, row.occurrence_starts_at)] = row
    end
  end

  def self.prune_or_save!(row)
    if row.ihss.nil? && row.service_type_id.nil?
      row.destroy! if row.persisted?
      return row
    end

    row.save!
    row
  end
  private_class_method :prune_or_save!
end
