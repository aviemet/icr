# == Schema Information
#
# Table name: doctors
#
#  id            :uuid             not null, primary key
#  notes         :text
#  npi           :string
#  practice_name :string
#  slug          :string           not null
#  specialty     :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  person_id     :uuid             not null
#
# Indexes
#
#  index_doctors_on_person_id  (person_id)
#  index_doctors_on_slug       (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#
FactoryBot.define do
  factory :doctor do
    person
  end
end
