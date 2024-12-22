# == Schema Information
#
# Table name: clients
#
#  id          :uuid             not null, primary key
#  active_at   :date
#  color       :string
#  inactive_at :date
#  number      :string
#  slug        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  person_id   :uuid             not null
#
# Indexes
#
#  index_clients_on_person_id  (person_id)
#  index_clients_on_slug       (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#
FactoryBot.define do
  factory :client do
    active_at { 2.years.ago }
    number { Faker::Alphanumeric.alpha(number: 8).upcase }

    person
  end
end
