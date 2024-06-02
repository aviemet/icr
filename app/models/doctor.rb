# == Schema Information
#
# Table name: doctors
#
#  id         :bigint           not null, primary key
#  first_name :string
#  last_name  :string
#  notes      :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Doctor < ApplicationRecord

  pg_search_scope(
    :search,
    against: [:first_name, :last_name, :notes],
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify

  has_many :doctors_clients, dependent: :nullify
  has_many :clients, through: :doctors_clients
  has_many :prescriptions, dependent: :nullify

  scope :includes_associated, -> { includes([]) }
end
