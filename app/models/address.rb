# == Schema Information
#
# Table name: addresses
#
#  id          :uuid             not null, primary key
#  address     :string           not null
#  address_2   :string
#  city        :string
#  country     :integer
#  name        :string
#  notes       :text
#  postal      :string
#  region      :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :uuid             not null
#  contact_id  :uuid
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
    against: [:name, :address, :address_2, :city, :region, :postal, :notes, :country],
    using: {
      tsearch: { prefix: true },
      trigram: {},
    },
  )

  resourcify

  enum :country, ISO3166::Country.codes

  before_destroy :nullify_primary_address

  belongs_to :contact

  validates :address, presence: true

  private

  def nullify_primary_address
    return unless contact.primary_address == self

    contact.update!(primary_address: nil)
  end
end
