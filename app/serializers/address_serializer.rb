# == Schema Information
#
# Table name: addresses
#
#  id          :bigint           not null, primary key
#  address     :string
#  address_2   :string
#  city        :string
#  country     :integer
#  notes       :text
#  postal      :string
#  region      :string
#  title       :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :bigint
#  contact_id  :bigint           not null
#
# Indexes
#
#  index_addresses_on_category_id  (category_id)
#  index_addresses_on_contact_id   (contact_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (contact_id => contacts.id)
#
class AddressSerializer < ApplicationSerializer
  object_as :address

  

  attributes(
    :title,
    :address,
    :address_2,
    :city,
    :region,
    :country,
    :postal,
    :notes,
    :contact_id,
    :category_id,
  )
end
