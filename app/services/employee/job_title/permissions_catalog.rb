class Employee::JobTitle::PermissionsCatalog
  ACTIONS = %w[index show create update destroy].freeze

  FORM_ACTION_TO_ROLE = {
    "index" => :index,
    "show" => :show,
    "create" => :create,
    "update" => :update,
    "delete" => :destroy,
    "destroy" => :destroy,
  }.freeze

  ROLE_TO_FORM_ACTION = {
    index: "index",
    show: "show",
    create: "create",
    update: "update",
    destroy: "delete",
  }.freeze

  RESOURCES = {
    "employee" => Employee,
    "client" => Client,
    "doctor" => Doctor,
    "vendor" => Vendor,
    "timesheet" => Timesheet,
    "calendar_event" => Calendar::Event,
    "setting" => Setting,
    "incident_report" => IncidentReport,
    "prescription" => Prescription,
    "medication" => Medication,
  }.freeze

  def self.resource_keys
    RESOURCES.keys
  end

  def self.resource_class(key)
    RESOURCES[key.to_s]
  end

  def self.role_name_for(form_action)
    FORM_ACTION_TO_ROLE[form_action.to_s]
  end

  def self.form_action_for(role_name)
    ROLE_TO_FORM_ACTION[role_name.to_sym]
  end

  def self.empty_permissions
    {
      "admin" => false,
      **RESOURCES.keys.index_with { empty_resource_permissions },
    }
  end

  def self.empty_resource_permissions
    {
      "index" => false,
      "show" => false,
      "create" => false,
      "update" => false,
      "delete" => false,
    }
  end
end
