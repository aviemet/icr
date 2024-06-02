# == Schema Information
#
# Table name: emails
#
#  id          :bigint           not null, primary key
#  email       :string
#  notes       :text
#  title       :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :bigint
#  contact_id  :bigint           not null
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
    against: [:email, :notes],
    using: {
      tsearch: { prefix: true },
      trigram: {},
    },
  )

  resourcify

  belongs_to :contact
end
