# == Schema Information
#
# Table name: pay_rates
#
#  id            :bigint           not null, primary key
#  notes         :text
#  period        :integer          not null
#  rate_cents    :integer          default(0), not null
#  rate_currency :string           default("USD"), not null
#  title         :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
FactoryBot.define do
  factory :pay_rate do
    employee { nil }
    rate { "MyString" }
    period { 1 }
    starts_at { "2024-06-02" }
    ends_at { "2024-06-02" }
    title { "MyString" }
    notes { "MyText" }
  end
end
