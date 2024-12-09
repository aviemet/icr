# == Schema Information
#
# Table name: addresses
#
#  id          :uuid             not null, primary key
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
#  category_id :uuid
#  contact_id  :uuid             not null
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
class Address < ApplicationRecord
  include Categorizable

  pg_search_scope(
    :search,
    against: [:title, :address, :address_2, :city, :region, :postal, :notes, :country],
    using: {
      tsearch: { prefix: true },
      trigram: {},
    },
  )

  resourcify

  enum :country, ISO3166::Country.codes

  belongs_to :contact
end
