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

  DEFAULT_SETTINGS = {
    company_name: "SLS Agency",
    default_language: "en",
    default_currency: "USD",
    default_timezone: "America/Los_Angeles",
    pay_period_type: PAY_PERIOD_TYPES[:semi_monthly],
    shift_title_format: "{h:mm} - {full_name}",
  }.freeze

  field :company_name, type: :string, default: DEFAULT_SETTINGS[:company_name], validates: { presence: true }

  field :default_language, type: :string, default: DEFAULT_SETTINGS[:default_language], validates: { presence: true }
  field :default_currency, type: :string, default: DEFAULT_SETTINGS[:default_currency], validates: {
    presence: true,
  }
  field :default_timezone, type: :string, default: DEFAULT_SETTINGS[:default_timezone], validates: {
    presence: true
  }

  field :pay_period_type, type: :string, default: DEFAULT_SETTINGS[:pay_period_type], validates: {
    presence: true,
    inclusion: { in: PAY_PERIOD_TYPES.values }
  }

  ALLOWED_TEMPLATE_VARS = %i(first_name last_name full_name).freeze
  field :shift_title_format, type: :string, default: DEFAULT_SETTINGS[:shift_title_format], validates: {
    presence: true,
    format: {
      with: %r(\A[^{}]*(\{(?:#{ALLOWED_TEMPLATE_VARS.join('|')}|[YMDHhmsAa\-/ :]+)\}[^{}]*)*\z),
      message: "must contain valid variables and date formats"
    }
  }

  field :overtime_hours, type: :integer, default: 40, validates: { presence: true }

  def self.render
    Setting.keys.to_h { |key|
      [key.to_sym, Setting.send(key.to_sym)]
    }
  end
end
