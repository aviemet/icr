# == Schema Information
#
# Table name: identifications
#
#  id                      :uuid             not null, primary key
#  expires_at              :date
#  extra_fields            :jsonb
#  id_type                 :integer
#  identificationable_type :string           not null
#  issued_at               :date
#  notes                   :text
#  number                  :string
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
  pg_search_config(against: [:id_type, :number, :notes, :issued_at, :expires_at])

  resourcify

  belongs_to :identificationable, polymorphic: true

  enum :id_type, {
    drivers_license: 0,
    passport: 1,
    state_id: 2,
    military_id: 3,
    employee_id: 4,
    other: 5
  }, _column: :type

  validates :number, presence: true
  validates :id_type, presence: true

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
