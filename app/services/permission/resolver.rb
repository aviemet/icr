module Permission
  class Resolver
    def initialize(user)
      @user = user
    end

    def can?(resource, action, context = {})
      return true if user.has_role?(:admin)

      # Get all current permission assignments
      assignments = Permission::Assignment.current
        .where(permissionable: all_permissionable_associations)
        .includes(:group)
        .order("permission_groups.precedence DESC")

      # Group permissions by precedence level
      by_precedence = assignments.group_by { |a| a.group.precedence }

      # At each precedence level
      by_precedence.each_value do |level_assignments|
        # If there's an explicit deny at this level, deny access
        return false if level_assignments.any? do |assignment|
          assignment.group.explicit_deny?(resource, action, context)
        end

        # If there's an explicit allow at this level, allow access
        return true if level_assignments.any? do |assignment|
          assignment.group.explicit_allow?(resource, action, context)
        end

        # If no decision at this level, continue to next precedence level
      end

      # If no permission matched, implicit deny
      false
    end

    private

    attr_reader :user

    def all_permissionable_associations
      user.permissionable_associations
    end
  end
end
