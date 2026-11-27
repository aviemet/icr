# == Schema Information
#
# Table name: service_types
#
#  id                  :uuid             not null, primary key
#  active              :boolean          default(TRUE), not null
#  allows_multi_client :boolean          default(FALSE), not null
#  assignable          :boolean          default(TRUE), not null
#  billable            :boolean          default(TRUE), not null
#  color               :string           default("#2F6FED"), not null
#  name                :string           not null
#  payable             :boolean          default(TRUE), not null
#  position            :integer          default(0), not null
#  requires_notes      :boolean          default(FALSE), not null
#  slug                :string           not null
#  system              :boolean          default(FALSE), not null
#  tracks_mileage      :boolean          default(FALSE), not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#
# Indexes
#
#  index_service_types_on_active    (active)
#  index_service_types_on_name      (name) UNIQUE
#  index_service_types_on_position  (position)
#  index_service_types_on_slug      (slug) UNIQUE
#
class ServiceType < ApplicationRecord
  COLOR_FORMAT = /\A#[0-9A-Fa-f]{6}\z/

  extend FriendlyId

  friendly_id :name, use: [:slugged, :history]

  resourcify

  has_many :shifts, dependent: :restrict_with_exception, inverse_of: :service_type

  validates :name, presence: true, uniqueness: true
  validates :slug, presence: true, uniqueness: true
  validates :color, presence: true, format: { with: COLOR_FORMAT }
  validates :position, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validate :prevent_system_destroy, on: :destroy

  before_update :protect_system_slug
  before_destroy :abort_system_destroy

  scope :active, -> { where(active: true) }
  scope :assignable, -> { where(assignable: true) }
  scope :ordered, -> { order(:position, :name) }
  scope :includes_associated, -> { all }

  def self.default
    active.assignable.ordered.find_by(slug: "regular") ||
      active.assignable.ordered.find_by(slug: "standard") ||
      active.assignable.ordered.first ||
      ordered.first
  end

  def to_s
    name
  end

  private

  def prevent_system_destroy
    return unless system?

    errors.add(:base, "system service types cannot be deleted")
  end

  def abort_system_destroy
    return unless system?

    throw(:abort)
  end

  def protect_system_slug
    return unless system?
    return unless will_save_change_to_slug?

    self.slug = slug_in_database
  end
end
