class Employee::JobTitle::PermissionsCatalog
  CRUD_ACTIONS = %w[index show create update destroy].freeze

  ACTIONS = CRUD_ACTIONS

  EXTRA_ACTIONS = {
    "employee_training" => %w[complete],
  }.freeze

  FORM_ACTION_TO_ROLE = {
    "index" => :index,
    "show" => :show,
    "create" => :create,
    "update" => :update,
    "delete" => :destroy,
    "destroy" => :destroy,
    "complete" => :complete,
  }.freeze

  ROLE_TO_FORM_ACTION = {
    index: "index",
    show: "show",
    create: "create",
    update: "update",
    destroy: "delete",
    complete: "complete",
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
    "clients_manager" => ClientsManager,
    "employee_training" => Employee::Training,
    "requirement" => Requirement::Requirement,
    "report_definition" => ReportDefinition,
    "report_request" => ReportRequest,
  }.freeze

  def self.resource_keys
    RESOURCES.keys
  end

  def self.resource_class(key)
    RESOURCES[key.to_s]
  end

  def self.actions_for(resource_key)
    CRUD_ACTIONS + Array(EXTRA_ACTIONS[resource_key.to_s])
  end

  def self.form_actions_for(resource_key)
    actions_for(resource_key).filter_map { |action| form_action_for(action) }
  end

  def self.all_managed_actions
    (CRUD_ACTIONS + EXTRA_ACTIONS.values.flatten).uniq
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
      **RESOURCES.keys.index_with { |key| empty_resource_permissions(key) },
    }
  end

  def self.empty_resource_permissions(resource_key = nil)
    form_actions = if resource_key
                     form_actions_for(resource_key)
                   else
                     %w[index show create update delete]
                   end

    form_actions.index_with { false }
  end

  def self.permitted_form_actions_for(resource_key)
    form_actions_for(resource_key).map(&:to_sym)
  end
end
