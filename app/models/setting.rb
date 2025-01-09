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
class Setting < RailsSettings::Base
  cache_prefix { "v1" }

  PAY_PERIOD_TYPES = {
    weekly: "weekly",
    bi_weekly: "bi_weekly",
    semi_monthly: "semi_monthly",
    monthly: "monthly",
  }.freeze

  field :company_name, type: :string, default: "SLS Agency", validates: { presence: true }

  field :default_language, type: :string, default: "en/US", validates: { presence: true }
  field :default_currency, type: :string, default: "USD", validates: { presence: true }
  field :default_timezone, type: :string, default: "America/Los Angelas", validates: { presence: true }

  field :pay_period_type, type: :string, default: PAY_PERIOD_TYPES[:semi_monthly], validates: { presence: true, inclusion: { in: PAY_PERIOD_TYPES.values } }

  def self.render
    Setting.keys.to_h { |key|
      [key.to_sym, Setting.send(key.to_sym)]
    }
  end
end
