class Employee::JobTitle::PermissionsReader
  def self.call(job_title)
    new(job_title).call
  end

  def initialize(job_title)
    @job_title = job_title
  end

  def call
    permissions = Employee::JobTitle::PermissionsCatalog.empty_permissions

    Employee::JobTitle::PermissionsCatalog::RESOURCES.each do |key, resource_class|
      Employee::JobTitle::PermissionsCatalog.actions_for(key).each do |action|
        form_action = Employee::JobTitle::PermissionsCatalog.form_action_for(action)
        next if form_action.nil?

        permissions[key][form_action] = job_title.has_role?(action.to_sym, resource_class)
      end
    end

    permissions["admin"] = all_actions_granted?(permissions)
    permissions
  end

  private

  attr_reader :job_title

  def all_actions_granted?(permissions)
    Employee::JobTitle::PermissionsCatalog.resource_keys.all? do |key|
      Employee::JobTitle::PermissionsCatalog.form_actions_for(key).all? do |form_action|
        permissions[key][form_action]
      end
    end
  end
end
