class Settings::PublicSerializer < BaseSerializer
  keys_to_select = %w[company_name]

  filtered_fields = Setting.defined_fields.select do |field|
    keys_to_select.include?(field.key)
  end

  field_options = filtered_fields.map do |field|
    options = { type: field.type }
    options[:optional] = true if field.default.nil?
    [field.key.to_sym, options]
  end

  attributes(**field_options.to_h)
end
