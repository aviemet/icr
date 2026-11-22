# == Schema Information
#
# Table name: dosages
#
#  id                    :uuid             not null, primary key
#  administration_method :integer
#  amount                :decimal(, )
#  amount_unit           :integer
#  freq_amount           :decimal(, )
#  freq_period           :integer
#  notes                 :text
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#
class Dosage < ApplicationRecord
  resourcify

  has_one :prescription, dependent: :nullify

  enum :amount_unit, {
    mg: 0,
    ml: 1,
    tablet: 2,
    capsule: 3,
    unit: 4,
    other: 5
  }, prefix: true

  enum :freq_period, {
    hour: 0,
    day: 1,
    week: 2,
    month: 3,
    as_needed: 4
  }, prefix: true

  enum :administration_method, {
    oral: 0,
    sublingual: 1,
    injection: 2,
    topical: 3,
    inhaled: 4,
    rectal: 5,
    other: 6
  }, prefix: true

  validates :amount, presence: true
  validates :freq_period, presence: true


  scope :includes_associated, -> { includes([:prescription]) }
end
