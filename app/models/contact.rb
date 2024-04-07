# == Schema Information
#
# Table name: contacts
#
#  id                 :bigint           not null, primary key
#  contactable_type   :string           not null
#  notes              :text
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  contactable_id     :bigint           not null
#  primary_address_id :bigint
#  primary_email_id   :bigint
#  primary_phone_id   :bigint
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
class Contact < ApplicationRecord
  has_many :addresses, dependent: :delete_all
  has_many :emails, dependent: :delete_all
  has_many :phones, dependent: :delete_all

  belongs_to :contactable, polymorphic: true
end
