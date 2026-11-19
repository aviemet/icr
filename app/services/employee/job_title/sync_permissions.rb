class Employee::JobTitle::SyncPermissions
  CACHE_KEY_PREFIX = "user_permissions".freeze

  def self.call(job_title, permissions)
    new(job_title, permissions).call
  end

  def initialize(job_title, permissions)
    @job_title = job_title
    @permissions = normalize(permissions)
  end

  def call
    desired = desired_roles
    sync_roles(desired)
    invalidate_user_permission_caches
    true
  end

  private

  attr_reader :job_title, :permissions

  def normalize(raw)
    return Employee::JobTitle::PermissionsCatalog.empty_permissions if raw.blank?

    raw.to_h.deep_stringify_keys
  end

  def desired_roles
    roles = Set.new

    if ActiveModel::Type::Boolean.new.cast(permissions["admin"])
      Employee::JobTitle::PermissionsCatalog::RESOURCES.each_value do |resource_class|
        Employee::JobTitle::PermissionsCatalog::ACTIONS.each do |action|
          roles << [action.to_sym, resource_class]
        end
      end
      return roles
    end

    Employee::JobTitle::PermissionsCatalog::RESOURCES.each do |key, resource_class|
      resource_permissions = permissions[key]
      next unless resource_permissions.is_a?(Hash)

      resource_permissions.each do |form_action, enabled|
        next unless ActiveModel::Type::Boolean.new.cast(enabled)

        role_name = Employee::JobTitle::PermissionsCatalog.role_name_for(form_action)
        next if role_name.nil?

        roles << [role_name, resource_class]
      end
    end

    roles
  end

  def sync_roles(desired)
    current = current_managed_roles

    (current - desired).each do |role_name, resource_class|
      job_title.remove_role(role_name, resource_class)
    end

    (desired - current).each do |role_name, resource_class|
      job_title.add_role(role_name, resource_class)
    end
  end

  def current_managed_roles
    managed_resource_types = Employee::JobTitle::PermissionsCatalog::RESOURCES.values.map(&:name)

    job_title.roles.each_with_object(Set.new) do |role, roles|
      next if role.resource_type.blank?
      next unless managed_resource_types.include?(role.resource_type)
      next unless Employee::JobTitle::PermissionsCatalog::ACTIONS.include?(role.name)

      resource_class = role.resource_type.constantize
      roles << [role.name.to_sym, resource_class]
    end
  end

  def invalidate_user_permission_caches
    user_ids = User
      .joins(person: { employee: :active_employees_job_title })
      .where(employees_job_titles: { job_title_id: job_title.id })
      .pluck(:id)

    user_ids.each do |user_id|
      Rails.cache.delete("#{CACHE_KEY_PREFIX}/#{user_id}")
    end
  end
end
