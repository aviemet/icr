module ColorMappingFields
  extend ActiveSupport::Concern

  included do
    attributes(
      color_mappings: { type: "Record<string, Record<string, string>>" },
    )
  end
end
