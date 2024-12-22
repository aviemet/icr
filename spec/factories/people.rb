# == Schema Information
#
# Table name: people
#
#  id              :uuid             not null, primary key
#  characteristics :jsonb
#  dob             :date
#  first_name      :string
#  last_name       :string
#  middle_name     :string
#  nick_name       :string
#  slug            :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  user_id         :uuid
#
# Indexes
#
#  index_people_on_slug     (slug) UNIQUE
#  index_people_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :person do
    first_name { Faker::Name.first_name }
    middle_name { Faker::Name.middle_name }
    last_name { Faker::Name.last_name }
    nick_name { Faker::Name.initials(number: 2) }
    dob { Faker::Date.birthday(min_age: 18, max_age: 65) }
    characteristics { {} }

    factory :person_with_contacts do
      contact { association :contact, person: instance }
    end
  end
end
