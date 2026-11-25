# == Schema Information
#
# Table name: clients
#
#  id                    :uuid             not null, primary key
#  active_at             :date
#  color                 :string
#  communication_notes   :text
#  ihss_authorized_hours :decimal(8, 2)
#  ihss_notes            :text
#  ihss_share_of_cost    :decimal(10, 2)
#  inactive_at           :date
#  ipp_ends_on           :date
#  ipp_review_on         :date
#  ipp_starts_on         :date
#  medi_cal_number       :string
#  number                :string
#  preferred_hospital    :string
#  preferred_language    :string
#  referred_by_other     :string
#  slug                  :string           not null
#  uci_number            :string
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  person_id             :uuid             not null
#  regional_center_id    :uuid
#
# Indexes
#
#  index_clients_on_person_id           (person_id)
#  index_clients_on_regional_center_id  (regional_center_id)
#  index_clients_on_slug                (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#  fk_rails_...  (regional_center_id => regional_centers.id)
#
FactoryBot.define do
  factory :client do
    active_at { 2.years.ago }
    number { Faker::Alphanumeric.alpha(number: 8).upcase }
    uci_number { Faker::Number.number(digits: 7).to_s }
    preferred_language { "English" }
    regional_center

    person

    trait :with_profile do
      medi_cal_number { Faker::Number.number(digits: 9).to_s }
      ipp_starts_on { 1.year.ago.to_date }
      ipp_ends_on { 1.year.from_now.to_date }
      ipp_review_on { 6.months.from_now.to_date }
      preferred_hospital { "Highland Hospital" }
      ihss_authorized_hours { 80.0 }
      ihss_share_of_cost { 0 }
      ihss_notes { "IHSS coordinated with attendant schedule" }
      communication_notes { "Prefers plain language" }
    end
  end
end
