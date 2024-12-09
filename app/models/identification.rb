# == Schema Information
#
# Table name: identifications
#
#  id                      :uuid             not null, primary key
#  expires_at              :date
#  extra_fields            :jsonb
#  identificationable_type :string           not null
#  issued_at               :date
#  notes                   :text
#  number                  :integer
#  type                    :integer
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  identificationable_id   :uuid             not null
#
# Indexes
#
#  index_identifications_on_identificationable  (identificationable_type,identificationable_id)
#
class Identification < ApplicationRecord
  include Categorizable

  pg_search_scope(
    :search,
    against: [:identificationable, :type, :number, :notes, :issued_at, :expires_at, :extra_fields],
    associated_against: {
      identificationable: [],
    },
    using: {
      tsearch: { prefix: true },
      trigram: {}
    },
  )

  resourcify

  belongs_to :identificationable, polymorphic: true

  scope :includes_associated, -> { includes([:identificationable]) }
end
