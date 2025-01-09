# == Schema Information
#
# Table name: settings
#
#  id              :uuid             not null, primary key
#  data            :jsonb            not null
#  singleton_guard :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_settings_on_singleton_guard  (singleton_guard) UNIQUE
#
class Setting < ApplicationRecord
  pg_search_scope(
    :search,
    against: [:singelton_guard, :data],
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  tracked
  resourcify

  after_initialize :set_defaults
  before_validation :set_singleton_guard

  validates :singleton_guard, inclusion: { in: [0] }
  validate :validate_settings_schema

  scope :includes_associated, -> { includes([]) }

  private

  def set_singleton_guard
    self.singleton_guard = 0
  end

  def set_defaults
    return unless data.empty?

    self.data = Settings.defaults
  end

  def validate_settings_schema
    result = Settings::SettingsSchema.call(data)
    return if result.success?

    # Add validation errors if schema validation fails
    result.errors.to_h.each do |key, messages|
      errors.add(:data, "#{key}: #{messages.join(', ')}")
    end
  end
end
