# == Schema Information
#
# Table name: settings
#
#  id         :bigint           not null, primary key
#  value      :text
#  var        :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_settings_on_var  (var) UNIQUE
#
class SettingSerializer < BaseSerializer
  keys_to_ignore = %w[payroll_period_type]

  filtered_fields = Setting.defined_fields.reject do |field|
    keys_to_ignore.include?(field.key)
  end

  field_options = filtered_fields.map do |field|
    options = { type: field.type }
    options[:optional] = true if field.default.nil?
    [field.key.to_sym, options]
  end

  attributes(**field_options.to_h)

  attributes(
    payroll_period_type: { type: "PayrollPeriodType" },
  )
end
