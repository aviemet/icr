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
  has_many :addresses, dependent: :delete_all, after_add: :calculate_primary_address
  has_many :emails, dependent: :delete_all, after_add: :calculate_primary_email
  has_many :phones, dependent: :delete_all, after_add: :calculate_primary_phone

  belongs_to :primary_address, class_name: "Address", optional: true
  belongs_to :primary_email, class_name: "Email", optional: true
  belongs_to :primary_phone, class_name: "Phone", optional: true

  belongs_to :contactable, polymorphic: true

  # Override the getter for primary_address
  def primary_address
    super || calculate_primary(:addresses)
  end

  # Override the getter for primary_email
  def primary_email
    super || calculate_primary(:emails)
  end

  # Override the getter for primary_phone
  def primary_phone
    super || calculate_primary(:phones)
  end

  private

  def calculate_primary_address() calculate_primary(:address) end
  def calculate_primary_email() calculate_primary(:email) end
  def calculate_primary_phone() calculate_primary(:phone) end

  # Generic method to calculate and persist the primary record
  def calculate_primary(association_name)
    collection = send(association_name)
    if collection.count > 0
      primary_method_name = "primary_#{association_name.to_s.singularize}"
      update(primary_method_name => collection.first)
      send(primary_method_name)
    end
  end
end
