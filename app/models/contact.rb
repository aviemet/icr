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
class Contact < ApplicationRecord
  has_many :addresses, class_name: "Contact::Address", dependent: :destroy, after_add: :calculate_primary_address
  has_many :emails, class_name: "Contact::Email", dependent: :destroy, after_add: :calculate_primary_email
  has_many :phones, class_name: "Contact::Phone", dependent: :destroy, after_add: :calculate_primary_phone
  has_many :websites, class_name: "Contact::Website", dependent: :destroy

  belongs_to :primary_address, class_name: "Contact::Address", optional: true
  belongs_to :primary_email, class_name: "Contact::Email", optional: true
  belongs_to :primary_phone, class_name: "Contact::Phone", optional: true

  belongs_to :contactable, polymorphic: true

  def primary_address
    super || calculate_primary(:addresses)
  end

  def primary_email
    super || calculate_primary(:emails)
  end

  def primary_phone
    super || calculate_primary(:phones)
  end

  def calculate_primary_address(*_args) calculate_primary(:addresses) end
  def calculate_primary_email(*_args) calculate_primary(:emails) end
  def calculate_primary_phone(*_args) calculate_primary(:phones) end

  private

  def calculate_primary(association_name)
    collection = send(association_name)
    if collection.any?
      primary_method_name = "primary_#{association_name.to_s.singularize}"
      update(primary_method_name => collection.first)
      send(primary_method_name)
    end
  end
end
