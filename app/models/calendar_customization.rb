# == Schema Information
#
# Table name: calendar_customizations
#
#  id              :uuid             not null, primary key
#  color_mappings  :jsonb            not null
#  customizer_type :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  customizer_id   :uuid             not null
#
# Indexes
#
#  index_calendar_customizations_on_color_mappings  (color_mappings) USING gin
#  index_calendar_customizations_on_customizer      (customizer_type,customizer_id)
#
class CalendarCustomization < ApplicationRecord
  resourcify

  belongs_to :customizer, polymorphic: true

  scope :includes_associated, -> { includes([:customizer]) }
end
