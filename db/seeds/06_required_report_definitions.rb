# frozen_string_literal: true

definition = ReportDefinition.find_or_initialize_by(slug: "employee-requirement-expiration")
definition.assign_attributes(
  name: "Employee Requirement Expiration",
  resource_key: "employee_credential",
  mode: "list",
  format: "xlsx",
  columns: %w[
    employee_name
    employee_number
    credential_name
    credential_type
    issued_on
    expires_on
    status
  ],
  default_filters: {
    "within_days" => 30,
    "include_expired" => true,
  },
  grouper_keys: [],
  aggregator_keys: [],
  system: true,
  created_by: nil,
)
definition.save!

Rails.logger.info "[seeds] report definitions"
