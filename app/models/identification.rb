# == Schema Information
#
# Table name: identifications
#
#  id                      :uuid             not null, primary key
#  expires_at              :date
#  extra_fields            :jsonb
#  identificationable_type :string           not null
#  issued_at               :date
#  notes                   :text
#  number                  :string
#  type                    :integer
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  category_id             :uuid             not null
#  identificationable_id   :uuid             not null
#
# Indexes
#
#  index_identifications_on_category_id         (category_id)
#  index_identifications_on_identificationable  (identificationable_type,identificationable_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#
class Identification < ApplicationRecord
  include Categorizable
  include Attachment::HasImages
  include Attachment::HasDocuments

  include PgSearchable
  pg_search_config(against: [:type, :number, :notes, :issued_at, :expires_at])

  resourcify

  belongs_to :identificationable, polymorphic: true

  validates :number, presence: true
  validates :type, presence: true

  scope :expired, -> { where(expires_at: ...Date.current) }
  scope :active, -> { where("expires_at > ? OR expires_at IS NULL", Date.current) }
  scope :expiring_soon, -> { where("expires_at BETWEEN ? AND ?", Date.current, 30.days.from_now) }

  def expired?
    expires_at? && expires_at < Date.current
  end

  def active?
    !expired?
  end

end
