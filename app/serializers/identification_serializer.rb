# == Schema Information
#
# Table name: identifications
#
#  id                      :uuid             not null, primary key
#  expires_at              :date
#  extra_fields            :jsonb
#  id_type                 :integer
#  identificationable_type :string           not null
#  issued_at               :date
#  notes                   :text
#  number                  :string
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  category_id             :uuid             not null
#  identificationable_id   :uuid             not null
#
# Indexes
#
#  index_identifications_on_category_id         (category_id)
#  index_identifications_on_identificationable  (identificationable_type,identificationable_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#
class IdentificationSerializer < ApplicationSerializer
  attributes(
    :identificationable_type,
    :identificationable_id,
    :type,
    :number,
    :notes,
    :issued_at,
    :expires_at,
    :extra_fields,
  )
end
