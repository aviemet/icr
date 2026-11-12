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

WEEKDAYS = %w(monday tuesday wednesday thursday friday saturday sunday).freeze

class Setting < RailsSettings::Base
  include Renderable

  cache_prefix { "v1" }

  # Override RequestCache-dependent methods in test environment to avoid CurrentAttributes
  # initialization issues when classes reload (e.g., with rspec-watcher). Since we use
  # :null_store in tests, request-level caching isn't needed anyway, so we bypass
  # RequestCache entirely and fetch directly from cache_storage (which queries the DB).
  if Rails.env.test?
    def self._all_settings
      cache_storage.fetch(cache_key, expires_in: 1.week) do
        vars = unscoped.select("var, value")
        result = {}
        vars.each { |record| result[record.var] = record.value }
        result.with_indifferent_access
      end
    end

    def self.clear_cache
      cache_storage.delete(cache_key)
    end

    delegate :clear_cache, to: :class
  end

  PAY_PERIOD_TYPES = {
    weekly: "weekly",
    bi_weekly: "bi_weekly",
    semi_monthly: "semi_monthly",
    monthly: "monthly",
  }.freeze

  PAYROLL_DUE_DATE_RULE_TYPES = {
    days_after_period_end: "days_after_period_end",
    day_of_week_after_period_end: "day_of_week_after_period_end",
    day_of_month: "day_of_month",
  }.freeze

  DEFAULT_SETTINGS = {
    company_name: "SLS Agency",
    default_language: "en",
    default_currency: "USD",
    default_timezone: "America/Los_Angeles",
    shift_title_format: "{start:h:mma} - {end:h:mma}: {full_name}",
    overtime_weekly_hours: 40,
    overtime_daily_hours: 8,
    payroll_period_type: PAY_PERIOD_TYPES[:semi_monthly],
    payroll_period_day: "monday",
    payroll_period_date: "1",
    payroll_period_date_2: "15",
    payroll_due_date_rule_type: PAYROLL_DUE_DATE_RULE_TYPES[:days_after_period_end],
    payroll_due_date_days: 5,
    payroll_due_date_day_of_week: "tuesday",
    payroll_due_date_day_of_month: "5",
    calendar_layout_style: "split",
    calendar_split_events_show_original_times: false
  }.freeze

  field :company_name, type: :string, default: DEFAULT_SETTINGS[:company_name], validates: { presence: true }

  field :default_language, type: :string, default: DEFAULT_SETTINGS[:default_language], validates: { presence: true }
  field :default_currency, type: :string, default: DEFAULT_SETTINGS[:default_currency], validates: {
    presence: true,
  }
  field :default_timezone, type: :string, default: DEFAULT_SETTINGS[:default_timezone], validates: {
    presence: true
  }

  ########################
  # Event Title Template #
  ########################
  ALLOWED_TEMPLATE_VARS = %i(first_name last_name full_name first_initial last_initial).freeze
  field :shift_title_format, type: :string, default: DEFAULT_SETTINGS[:shift_title_format], validates: {
    presence: true,
    format: {
      with: %r(\A[^{}]*(\{(?:#{ALLOWED_TEMPLATE_VARS.join('|')}|(?:start|end):[YMDHhmsAa\-/ :]+)\}[^{}]*)*\z),
      message: "must contain valid variables and date formats"
    }
  }

  field :overtime_weekly_hours, type: :integer, default: 40, validates: { presence: true }
  field :overtime_daily_hours, type: :integer, default: 8, validates: { presence: true }

  field :payroll_period_type, type: :string, default: DEFAULT_SETTINGS[:payroll_period_type], validates: {
    presence: true,
    inclusion: { in: PAY_PERIOD_TYPES.values }
  }
  field :payroll_period_day, type: :string, default: "monday", validates: {
    presence: true,
    inclusion: { in: WEEKDAYS }
  }

  field :payroll_period_date, type: :string, default: "1", validates: {
    presence: true,
    inclusion: { in: %w(1 5 15 20 -1) }
  }
  field :payroll_period_date_2, type: :string, default: "15", validates: {
    presence: true,
    inclusion: { in: %w(15 20 -1) }
  }

  field :payroll_due_date_rule_type, type: :string, default: DEFAULT_SETTINGS[:payroll_due_date_rule_type], validates: {
    presence: true,
    inclusion: { in: PAYROLL_DUE_DATE_RULE_TYPES.values }
  }
  field :payroll_due_date_days, type: :integer, default: DEFAULT_SETTINGS[:payroll_due_date_days], validates: {
    presence: true,
    numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 31 }
  }
  field :payroll_due_date_day_of_week, type: :string, default: DEFAULT_SETTINGS[:payroll_due_date_day_of_week], validates: {
    presence: true,
    inclusion: { in: WEEKDAYS }
  }
  field :payroll_due_date_day_of_month, type: :string, default: DEFAULT_SETTINGS[:payroll_due_date_day_of_month], validates: {
    presence: true,
    inclusion: { in: %w(1 5 10 15 20 25 -1) }
  }

  layout_styles = %w(span stack split)
  layout_style_type = layout_styles.map { |s| "\"#{s}\"" }.join("|")
  field :calendar_layout_style, type: layout_style_type, default: "split", validates: {
    presence: true,
    inclusion: { in: layout_styles }
  }
  field :calendar_split_events_show_original_times, type: :boolean, default: false
  field :first_day_of_week, type: :integer, default: 0, validates: {
    presence: true,
    inclusion: { in: (0..6).to_a }
  }
end
