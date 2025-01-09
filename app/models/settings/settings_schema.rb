require "dry-schema"
require "dry-types"

module Settings
  module Types
    include Dry.Types()

    # Define the structure once with both type and validation rules
    SCHEMA_DEFINITION = {
      company: {
        company_name: { type: Types::String, default: "SLS Agency".freeze }
      },
      locale: {
        language: { type: Types::String, default: "en".freeze },
        currency: { type: Types::String, default: "USD".freeze },
        timezone: { type: Types::String, default: "America/Los Angeles".freeze }
      }
    }.freeze

    def self.build_type_schema(definition)
      schema_hash = {}

      definition.each do |key, value|
        schema_hash[key] = if value.is_a?(Hash) && value[:type].nil?
                             build_type_schema(value)
                           else
                             value[:type].default(value[:default])
                           end
      end

      Types::Hash.schema(schema_hash)
    end

    Settings = build_type_schema(SCHEMA_DEFINITION)
  end

  # Build the Dry::Schema dynamically from the same definition
  SettingsSchema = Dry::Schema.JSON do
    SCHEMA_DEFINITION.each do |section, fields|
      required(section).hash do
        fields.each do |field, config|
          required(field).filled(config[:type].primitive)
        end
      end
    end
  end

  def self.defaults
    Types::Settings[{}]
  end
end
