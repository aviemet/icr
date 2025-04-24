# == Schema Information
#
# Table name: permission_assignments
#
#  id                  :uuid             not null, primary key
#  conditions          :jsonb
#  ends_at             :datetime
#  permissionable_type :string           not null
#  starts_at           :datetime
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  permission_group_id :uuid             not null
#  permissionable_id   :uuid             not null
#
# Indexes
#
#  index_permission_assignments_on_permission_group_id  (permission_group_id)
#  index_permission_assignments_on_permissionable       (permissionable_type,permissionable_id)
#
# Foreign Keys
#
#  fk_rails_...  (permission_group_id => permission_groups.id)
#
module Permission
  class Assignment < ApplicationRecord
    self.table_name = "permission_assignments"

    include PgSearchable
    pg_search_config(against: [:starts_at, :ends_at, :conditions],
      associated_against: {
        group: [],
      },)

    tracked
    resourcify

    belongs_to :group,
      class_name: "Permission::Group",
      foreign_key: :permission_group_id,
      inverse_of: :assignments
    belongs_to :permissionable, polymorphic: true

    validates :permission_group_id, uniqueness: {
      scope: [:permissionable_type, :permissionable_id],
      message: "has already been assigned to this resource"
    }

    validates :starts_at, presence: true
    validate :ends_at_after_starts_at, if: -> { ends_at.present? }

    scope :current, -> {
      current_time = Time.current
      where("starts_at <= ? AND (ends_at IS NULL OR ends_at >= ?)",
        current_time, current_time,)
    }

    scope :includes_associated, -> { includes([:group, :permissionable]) }

    private

    def ends_at_after_starts_at
      return if ends_at.blank? || starts_at.blank?

      if ends_at < starts_at
        errors.add(:ends_at, "must be after starts_at")
      end
    end
  end
end
