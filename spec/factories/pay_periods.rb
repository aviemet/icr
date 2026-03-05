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
FactoryBot.define do
  factory :pay_period do
    starts_at { "2026-03-04 16:19:06" }
    ends_at { "2026-03-04 16:19:06" }
    status { 1 }
    approved_at { "2026-03-04 16:19:06" }
    period_type { 1 }
    config_snapshot { "" }
  end
end
