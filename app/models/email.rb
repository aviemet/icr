# == Schema Information
#
# Table name: emails
#
#  id          :uuid             not null, primary key
#  email       :string           not null
#  name        :string
#  notes       :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :uuid             not null
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

  resourcify

  before_destroy :nullify_primary_email

  belongs_to :contact

  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }

  private

  def nullify_primary_email
    return unless contact.primary_email == self

    contact.update!(primary_email: nil)
  end
end
