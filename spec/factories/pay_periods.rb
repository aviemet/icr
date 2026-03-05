# == Schema Information
#
# Table name: pay_periods
#
#  id              :uuid             not null, primary key
#  approved_at     :datetime
#  config_snapshot :jsonb
#  ends_at         :datetime
#  period_type     :integer
#  starts_at       :datetime
#  status          :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_pay_periods_on_starts_at_and_ends_at  (starts_at,ends_at) UNIQUE
#
FactoryBot.define do
  sequence :pay_period_starts_at do |n|
    (Date.current + (n * 14).days).to_time.beginning_of_day
  end

  sequence :pay_period_ends_at do |n|
    (Date.current + (n * 14).days + 13.days).to_time.end_of_day
  end

  factory :pay_period do
    starts_at { generate(:pay_period_starts_at) }
    ends_at { generate(:pay_period_ends_at) }
    status { 1 }
    approved_at { "2026-03-04 16:19:06" }
    period_type { 1 }
    config_snapshot { "" }
  end
end
