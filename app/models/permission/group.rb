# == Schema Information
#
# Table name: permission_groups
#
#  id          :uuid             not null, primary key
#  description :text
#  name        :string
#  permissions :jsonb
#  precedence  :integer
#  slug        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_permission_groups_on_name  (name) UNIQUE
#  index_permission_groups_on_slug  (slug) UNIQUE
#
module Permission
  class Group < ApplicationRecord
    self.table_name = "permission_groups"

    include PgSearchable
    pg_search_config(against: [:name, :description])

    tracked
    resourcify

    has_many :assignments,
      class_name: "Permission::Assignment",
      foreign_key: :permission_group_id,
      dependent: :destroy,
      inverse_of: :group
    has_many :users, through: :assignments,
      source: :permissionable, source_type: "User"
    has_many :job_titles, through: :assignments,
      source: :permissionable, source_type: "Employee::JobTitle"

    validates :name, presence: true, uniqueness: true
    validates :description, presence: true
    validates :precedence, presence: true, numericality: { only_integer: true }

    before_validation :ensure_permissions

    def permissions_array
      permissions || []
    end

    def permissions_array=(value)
      self.permissions = value
    end

    def permission?(resource, action, context = {})
      Rails.logger.debug { "Checking permission in group #{name}: resource=#{resource}, action=#{action}, context=#{context}" }
      Rails.logger.debug { "Current permissions: #{permissions.inspect}" }

      matching_permission = permissions_array.find do |permission|
        matches = permission["resource"] == resource.to_s &&
          permission["action"] == action.to_s &&
          evaluate_conditions(permission["conditions"], context)
        Rails.logger.debug { "Permission #{permission.inspect} matches? #{matches}" }
        matches
      end

      result = matching_permission&.[]("effect") == "allow"
      Rails.logger.debug { "Permission check result: #{result}" }
      result
    end

    def explicit_deny?(resource, action, context = {})
      Rails.logger.debug { "Checking explicit deny in group #{name}: resource=#{resource}, action=#{action}, context=#{context}" }
      result = permissions_array.any? do |permission|
        matches = permission["resource"] == resource.to_s &&
          permission["action"] == action.to_s &&
          permission["effect"] == "deny" &&
          evaluate_conditions(permission["conditions"], context)
        Rails.logger.debug { "Permission #{permission.inspect} matches deny? #{matches}" }
        matches
      end
      Rails.logger.debug { "Explicit deny check result: #{result}" }
      result
    end

    def explicit_allow?(resource, action, context = {})
      Rails.logger.debug { "Checking explicit allow in group #{name}: resource=#{resource}, action=#{action}, context=#{context}" }
      result = permissions_array.any? do |permission|
        matches = permission["resource"] == resource.to_s &&
          permission["action"] == action.to_s &&
          permission["effect"] == "allow" &&
          evaluate_conditions(permission["conditions"], context)
        Rails.logger.debug { "Permission #{permission.inspect} matches allow? #{matches}" }
        matches
      end
      Rails.logger.debug { "Explicit allow check result: #{result}" }
      result
    end

    private

    def ensure_permissions
      self.permissions ||= []
    end

    def evaluate_conditions(conditions, context)
      return true if conditions.blank?

      conditions.all? do |key, value|
        case key
        when "owner_only"
          if context[:user_id].blank? || context[:record_user_id].blank?
            false
          else
            context[:user_id] == context[:record_user_id]
          end
        when "time_restricted"
          if value["start_time"].blank? || value["end_time"].blank?
            false
          else
            start_time = Time.zone.parse(value["start_time"])
            end_time = Time.zone.parse(value["end_time"])
            current_time = Time.current
            current_time.between?(start_time, end_time)
          end
        else
          context[key.to_sym] == value
        end
      end
    end
  end
end
