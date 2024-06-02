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

  has_many :clients, dependent: :nullify
end
