# == Schema Information
#
# Table name: households
#
#  id         :bigint           not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Household < ApplicationRecord
  include Contactable
  include Shiftable

  pg_search_scope(
    :search,
    against: [:name],
    associated_against: {
      employee: [],
      client: [],
    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  has_many :households_clients, dependent: :nullify
  has_many :clients, through: :households_clients, dependent: :nullify
end
