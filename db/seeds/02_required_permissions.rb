[
  "Executive",
  "Administrative",
  "Hourly",
  "Legal",
  "Human Resources",
].each do |name|
  Employee::Department.find_or_create_by!(name: name)
end

departments = Employee::Department.where(name: [
  "Executive",
  "Administrative",
  "Hourly",
  "Legal",
  "Human Resources",
]).index_by(&:name)

job_title_defaults = [
  {
    name: "Attendant",
    description: "Frontline hourly employee",
    department: "Hourly",
    permissions: Employee::JobTitle::PermissionsCatalog.empty_permissions,
  },
  {
    name: "Facilitator",
    description: "Manages clients and employees",
    department: "Administrative",
    permissions: {
      "admin" => false,
      "client" => { "index" => true, "show" => true, "create" => false, "update" => false, "delete" => false },
      "household" => { "index" => true, "show" => true, "create" => false, "update" => false, "delete" => false },
      "employee" => { "index" => true, "show" => true, "create" => false, "update" => false, "delete" => false },
      "doctor" => { "index" => true, "show" => true, "create" => false, "update" => false, "delete" => false },
      "vendor" => { "index" => true, "show" => true, "create" => false, "update" => false, "delete" => false },
      "timesheet" => { "index" => false, "show" => true, "create" => false, "update" => true, "delete" => false },
      "calendar_event" => { "index" => true, "show" => true, "create" => false, "update" => false, "delete" => false },
      "setting" => { "index" => false, "show" => false, "create" => false, "update" => false, "delete" => false },
      "incident_report" => { "index" => true, "show" => true, "create" => true, "update" => true, "delete" => false },
      "employee_training" => { "index" => true, "show" => true, "create" => false, "update" => false, "delete" => false, "complete" => true },
      "report_definition" => { "index" => true, "show" => true, "create" => false, "update" => false, "delete" => false },
      "report_request" => { "index" => true, "show" => true, "create" => true, "update" => false, "delete" => false },
      "compliance_form_template" => { "index" => true, "show" => true, "create" => false, "update" => false, "delete" => false },
      "compliance_form_submission" => { "index" => true, "show" => true, "create" => true, "update" => true, "delete" => false },
      "service_type" => { "index" => true, "show" => true, "create" => false, "update" => false, "delete" => false },
    },
  },
  {
    name: "Director",
    description: "Broad operational access",
    department: "Executive",
    permissions: {
      "admin" => true,
    },
  },
]

job_title_defaults.each do |attributes|
  job_title = Employee::JobTitle.find_or_initialize_by(name: attributes[:name])
  job_title.description = attributes[:description]
  job_title.department = departments.fetch(attributes[:department])
  job_title.save!

  Employee::JobTitle::SyncPermissions.call(job_title, attributes[:permissions])
end

Employee::Department.find_by(name: "Support")&.destroy!

Rails.logger.info "[seeds] departments, job titles, and default permissions"
