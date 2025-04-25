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
  factory :phone, class: "Contact::Phone" do
    number { Faker::PhoneNumber.phone_number }

    contact

    after(:build) do |phone|
      phone.category ||= create(:category, categorizable_type: "Contact::Phone")
    end
  end
end
