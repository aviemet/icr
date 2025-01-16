# == Schema Information
#
# Table name: phones
#
#  id          :uuid             not null, primary key
#  extension   :string
#  name        :string
#  notes       :text
#  number      :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :uuid             not null
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

  resourcify

  before_destroy :nullify_primary_phone

  belongs_to :contact

  validates :number, presence: true

  private

  def nullify_primary_phone
    return unless contact.primary_phone == self

    contact.update!(primary_phone: nil)
  end
end
