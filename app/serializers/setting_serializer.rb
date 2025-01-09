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
  attributes(**Setting.defined_fields.to_h { |field|
    options = { type: field.type }
    options[:optional] = true if field.default.nil?

    [field.key.to_sym, options]
  })
end
