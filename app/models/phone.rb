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
#  category_id :uuid             not null
#  contact_id  :uuid             not null
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

  belongs_to :contact
end
