# frozen_string_literal: true

module Reports
  class SystemDefinitions
    DEFINITIONS = {
      "employee-requirement-expiration" => {
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
      },
      "client-face-sheet" => {
        name: "Client Face Sheet",
        resource_key: "client_face_sheet",
        mode: "custom",
        format: "pdf",
        columns: [],
        default_filters: {},
        grouper_keys: [],
        aggregator_keys: [],
        system: true,
        created_by: nil,
      },
    }.freeze

    def self.ensure!(slug)
      attributes = DEFINITIONS.fetch(slug.to_s) {
        raise ArgumentError, "Unknown system report definition: #{slug}"
      }

      definition = ReportDefinition.find_or_initialize_by(slug: slug.to_s)
      definition.assign_attributes(attributes)
      definition.save!
      definition
    end

    def self.ensure_all!
      DEFINITIONS.each_key { |slug| ensure!(slug) }
    end
  end
end
