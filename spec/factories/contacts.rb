# == Schema Information
#
# Table name: contacts
#
#  id                 :uuid             not null, primary key
#  contactable_type   :string           not null
#  notes              :text
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  contactable_id     :uuid             not null
#  primary_address_id :uuid
#  primary_email_id   :uuid
#  primary_phone_id   :uuid
#
# Indexes
#
#  index_contacts_on_contactable         (contactable_type,contactable_id)
#  index_contacts_on_primary_address_id  (primary_address_id)
#  index_contacts_on_primary_email_id    (primary_email_id)
#  index_contacts_on_primary_phone_id    (primary_phone_id)
#
# Foreign Keys
#
#  fk_rails_...  (primary_address_id => addresses.id)
#  fk_rails_...  (primary_email_id => emails.id)
#  fk_rails_...  (primary_phone_id => phones.id)
#
FactoryBot.define do
  factory :contact do
    contactable { nil }

    trait :for_person do
      contactable factory: :person
    end

    trait :for_household do
      contactable factory: :household
    end

    trait :for_vendor do
      contactable factory: :vendor
    end

    transient do
      address_count { 0 }
      email_count { 0 }
      phone_count { 0 }
    end

    after(:create) do |contact, context|
      create_list(:address, context.address_count, contact: contact) if context.address_count > 0
      create_list(:email, context.email_count, contact: contact) if context.email_count > 0
      create_list(:phone, context.phone_count, contact: contact) if context.phone_count > 0
    end
  end
end
