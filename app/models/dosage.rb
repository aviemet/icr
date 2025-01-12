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
class Dosage < ApplicationRecord
  resourcify

  has_one :prescription, dependent: :nullify

  validates :amount, presence: true
  validates :freq_period, presence: true

  scope :includes_associated, -> { includes([:prescription]) }
end
