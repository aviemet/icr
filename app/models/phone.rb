# == Schema Information
#
# Table name: phones
#
#  id          :uuid             not null, primary key
#  extension   :string
#  notes       :text
#  number      :string           not null
#  title       :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :uuid
#  contact_id  :uuid
#
# Indexes
#
#  index_phones_on_category_id  (category_id)
#  index_phones_on_contact_id   (contact_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (contact_id => contacts.id)
#
class Phone < ApplicationRecord
  include Categorizable

  pg_search_scope(
    :search,
    against: [:number, :extension, :notes],
    using: {
      tsearch: { prefix: true },
      trigram: {},
    },
  )

  resourcify

  before_destroy :clear_primary_from_contact

  belongs_to :contact

  validates :number, presence: true

  private

  # Ensure the contact's primary_phone is cleared if this phone is being destroyed
  def clear_primary_from_contact
    if contact.primary_phone == self
      next_primary = contact.phones.where.not(id: id).first
      contact.update_column(:primary_phone_id, next_primary&.id) # rubocop:disable Rails/SkipsModelValidations
    end
  end
end
