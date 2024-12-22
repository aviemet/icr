# == Schema Information
#
# Table name: phones
#
#  id          :uuid             not null, primary key
#  extension   :string
#  name        :string
#  notes       :text
#  number      :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :uuid             not null
#  contact_id  :uuid
#
# Indexes
#
#  index_phones_on_category_id  (category_id)
#  index_phones_on_contact_id   (contact_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (contact_id => contacts.id)
#
FactoryBot.define do
  factory :phone do
    number { Faker::PhoneNumber.phone_number }

    contact

    category factory: [:category, :phone]
  end
end
