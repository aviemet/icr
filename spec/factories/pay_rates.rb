# == Schema Information
#
# Table name: pay_rates
#
#  id            :uuid             not null, primary key
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
    rate { Faker::Commerce.price(range: 18..50.0) }
    period { 0 }
  end
end
