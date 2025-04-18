# == Schema Information
#
# Table name: dosages
#
#  id          :uuid             not null, primary key
#  amount      :decimal(, )
#  amount_unit :integer
#  freq_amount :decimal(, )
#  freq_period :integer
#  notes       :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
FactoryBot.define do
  factory :dosage do
    amount { "9.99" }
    amount_unit { 1 }
    freq_amount { "9.99" }
    freq_period { 1 }
  end
end
