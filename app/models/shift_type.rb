# == Schema Information
#
# Table name: shift_types
#
#  id         :uuid             not null, primary key
#  notes      :text
#  title      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class ShiftType < ApplicationRecord

  pg_search_scope(
    :search,
    against: [:title, :notes],
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify


  scope :includes_associated, -> { includes([]) }
end
