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
FactoryBot.define do
  factory :identification do
    number { Faker::Alphanumeric.alpha(number: 16).upcase }
    issued_at { 2.years.ago }
    expires_at { 2.years.from_now }
    extra_fields { {} }
    id_type { :drivers_license }

    identificationable factory: :employee
    category factory: %i[category identification]
  end
end
