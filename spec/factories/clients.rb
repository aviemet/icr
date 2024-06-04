# == Schema Information
#
# Table name: clients
#
#  id          :bigint           not null, primary key
#  active_at   :date
#  color       :string
#  inactive_at :date
#  number      :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  person_id   :bigint           not null
#
# Indexes
#
#  index_clients_on_person_id  (person_id)
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#
FactoryBot.define do
  factory :client do
    active_at { "2024-02-01" }
    number { Faker::Alphanumeric.alpha(number: 8).upcase }

    person
  end
end
