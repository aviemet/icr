# == Schema Information
#
# Table name: regional_centers
#
#  id         :uuid             not null, primary key
#  active     :boolean          default(TRUE), not null
#  code       :string           not null
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_regional_centers_on_active  (active)
#  index_regional_centers_on_code    (code) UNIQUE
#
class RegionalCenter < ApplicationRecord
  include Contactable

  validates :code, presence: true, uniqueness: true
  validates :name, presence: true

  scope :active, -> { where(active: true) }
  scope :ordered, -> { order(:name) }
  scope :includes_associated, -> { includes(contact: [:addresses, :phones, :emails, :websites]) }
end
