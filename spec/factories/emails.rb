# == Schema Information
#
# Table name: emails
#
#  id          :uuid             not null, primary key
#  email       :string
#  notes       :text
#  title       :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :uuid
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
  factory :email do
    email { Faker::Internet.email }

    contact
    association :category, { categorizable_type: 'Email' } # rubocop:disable FactoryBot/AssociationStyle
  end
end
