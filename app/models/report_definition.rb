# frozen_string_literal: true

# == Schema Information
#
# Table name: report_definitions
#
#  id              :uuid             not null, primary key
#  aggregator_keys :jsonb            not null
#  columns         :jsonb            not null
#  default_filters :jsonb            not null
#  format          :string           default("xlsx"), not null
#  grouper_keys    :jsonb            not null
#  mode            :string           default("list"), not null
#  name            :string           not null
#  resource_key    :string           not null
#  slug            :string           not null
#  system          :boolean          default(FALSE), not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  created_by_id   :uuid
#
# Indexes
#
#  index_report_definitions_on_created_by_id  (created_by_id)
#  index_report_definitions_on_resource_key   (resource_key)
#  index_report_definitions_on_slug           (slug) UNIQUE
#  index_report_definitions_on_system         (system)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id)
#
class ReportDefinition < ApplicationRecord
  MODES = %w[list aggregate custom].freeze
  FORMATS = %w[xlsx csv pdf].freeze

  resourcify

  belongs_to :created_by, class_name: "User", optional: true
  has_many :report_requests, dependent: :restrict_with_exception

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true
  validates :resource_key, presence: true
  validates :mode, inclusion: { in: MODES }
  validates :format, inclusion: { in: FORMATS }
  validate :columns_present
  validate :resource_and_columns_in_registry

  scope :system_reports, -> { where(system: true) }
  scope :catalog, -> { where.not(mode: "custom") }

  def snapshot
    {
      "name" => name,
      "slug" => slug,
      "resource_key" => resource_key,
      "mode" => mode,
      "format" => format,
      "columns" => columns,
      "default_filters" => default_filters,
      "grouper_keys" => grouper_keys,
      "aggregator_keys" => aggregator_keys,
    }
  end

  def custom?
    mode == "custom"
  end

  private

  def columns_present
    return if custom?
    return if columns.is_a?(Array) && columns.any?

    errors.add(:columns, "must include at least one column")
  end

  def resource_and_columns_in_registry
    if custom?
      validate_custom_generator
      return
    end

    resource = Reports::Catalog.resource(resource_key)
    if resource.nil?
      errors.add(:resource_key, "is not a registered reportable resource")
      return
    end

    unknown = Array(columns).map(&:to_s) - resource.column_keys
    return if unknown.empty?

    errors.add(:columns, "contains unknown keys: #{unknown.join(', ')}")
  end

  def validate_custom_generator
    return if Reports::Custom::Registry.registered?(resource_key)

    errors.add(:resource_key, "is not a registered custom report generator")
  end
end
