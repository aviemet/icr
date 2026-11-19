# == Schema Information
#
# Table name: client_enrollments
#
#  id         :uuid             not null, primary key
#  ends_on    :date
#  notes      :text
#  starts_on  :date             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  client_id  :uuid             not null
#  vendor_id  :uuid             not null
#
# Indexes
#
#  idx_on_client_id_vendor_id_starts_on_6390a83a5d  (client_id,vendor_id,starts_on)
#  index_client_enrollments_on_client_id            (client_id)
#  index_client_enrollments_on_vendor_id            (vendor_id)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (vendor_id => vendors.id)
#
class Client::Enrollment < ApplicationRecord
  self.table_name = "client_enrollments"

  belongs_to :client
  belongs_to :vendor

  validates :starts_on, presence: true
  validate :ends_on_after_starts_on, if: :ends_on?

  scope :current, -> { where("starts_on <= ? AND (ends_on IS NULL OR ends_on >= ?)", Date.current, Date.current) }
  scope :includes_associated, -> { includes(:vendor, :client) }

  private

  def ends_on_after_starts_on
    return if ends_on.blank?

    if ends_on < starts_on
      errors.add(:ends_on, "must be after starts_on")
    end
  end
end
