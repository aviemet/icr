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
class DosageSerializer < ApplicationSerializer
  attributes(
    :amount,
    :amount_unit,
    :freq_amount,
    :freq_period,
    :notes,
  )
end
