# == Schema Information
#
# Table name: addresses
#
#  id          :uuid             not null, primary key
#  address     :string           not null
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
    against: [:title, :address, :address_2, :city, :region, :postal, :notes, :country],
    using: {
      tsearch: { prefix: true },
      trigram: {},
    },
  )

  resourcify

  enum :country, ISO3166::Country.codes

  before_destroy :clear_primary_from_contact

  belongs_to :contact

  validates :address, presence: true

  private

  # Ensure the contact's primary_address is cleared if this address is being destroyed
  def clear_primary_from_contact
    if contact.primary_address == self
      next_primary = contact.addresses.where.not(id: id).first
      contact.update_column(:primary_address_id, next_primary&.id) # rubocop:disable Rails/SkipsModelValidations
    end
  end
end
