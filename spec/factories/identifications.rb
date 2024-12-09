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
FactoryBot.define do
  factory :identification do
    number { Faker::Alphanumeric.alpha(number: 16).upcase }
    issued_at { Faker::Date.backward(days: 200) }
    expires_at { Faker::Date.forward(days: 365) }
    extra_fields { {} }
  end
end
