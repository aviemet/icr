# frozen_string_literal: true

module Reports
  class Catalog
    RESOURCES = {
      "employee_credential" => Reports::Resources::EmployeeCredential,
    }.freeze

    def self.resource_keys
      RESOURCES.keys
    end

    def self.resource(key)
      RESOURCES[key.to_s]
    end

    def self.fetch!(key)
      resource(key) || raise(ArgumentError, "Unknown reportable resource: #{key}")
    end
  end
end
