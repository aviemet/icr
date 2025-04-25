# == Schema Information
#
# Table name: emails
#
#  id          :uuid             not null, primary key
#  email       :string           not null
#  name        :string
#  notes       :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :uuid             not null
#  contact_id  :uuid
#
# Indexes
#
#  index_emails_on_category_id  (category_id)
#  index_emails_on_contact_id   (contact_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (contact_id => contacts.id)
#
FactoryBot.define do
  factory :email, class: "Contact::Email" do
    email { Faker::Internet.email }

    contact

    after(:build) do |email|
      email.category ||= create(:category, categorizable_type: "Contact::Email")
    end
  end
end
