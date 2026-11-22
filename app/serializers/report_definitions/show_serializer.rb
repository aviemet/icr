# frozen_string_literal: true

class ReportDefinitions::ShowSerializer < ReportDefinitionSerializer
  attributes(
    :id,
    :created_at,
    :updated_at,
  )

  type "Record<string, { label: string, type: string | null, default: unknown }>"
  def filter_schema
    resource = Reports::Catalog.resource(@object.resource_key)
    return {} if resource.nil?

    resource.filters.transform_values do |config|
      {
        label: config[:label],
        type: config[:type]&.to_s,
        default: config[:default],
      }
    end
  end
end
