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
class Email < ApplicationRecord
  include Categorizable

  pg_search_scope(
    :search,
    against: [:email, :title, :notes],
    using: {
      tsearch: { prefix: true },
      trigram: {},
    },
  )

  resourcify

  before_destroy :clear_primary_from_contact

  belongs_to :contact

  validates :email, presence: true

  private

  # Ensure the contact's primary_email is cleared if this email is being destroyed
  def clear_primary_from_contact
    if contact.primary_email == self
      next_primary = contact.emails.where.not(id: id).first
      contact.update_column(:primary_email_id, next_primary&.id) # rubocop:disable Rails/SkipsModelValidations
    end
  end
end
