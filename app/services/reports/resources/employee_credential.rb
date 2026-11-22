# frozen_string_literal: true

module Reports
  module Resources
    class EmployeeCredential < Base
      def self.key
        "employee_credential"
      end

      def self.columns
        {
          "employee_name" => {
            label: "Employee",
            extractor: ->(record) { record.employee.full_name.presence || record.employee.name },
          },
          "employee_number" => {
            label: "Employee Number",
            extractor: ->(record) { record.employee.number },
          },
          "credential_name" => {
            label: "Credential",
            extractor: ->(record) { record.name },
          },
          "credential_type" => {
            label: "Type",
            extractor: ->(record) { record.credential_type },
          },
          "issued_on" => {
            label: "Issued On",
            extractor: ->(record) { record.issued_on&.iso8601 },
          },
          "expires_on" => {
            label: "Expires On",
            extractor: ->(record) { record.expires_on&.iso8601 },
          },
          "status" => {
            label: "Status",
            extractor: ->(record) { expiration_status(record) },
          },
        }
      end

      def self.filters
        {
          "within_days" => {
            label: "Expiring within days",
            type: :integer,
            default: 30,
          },
          "include_expired" => {
            label: "Include expired",
            type: :boolean,
            default: true,
          },
        }
      end

      def self.policy_scope(user)
        employee_ids = Pundit.policy_scope!(user, Employee).select(:id)
        ::Employee::Credential.where(employee_id: employee_ids).includes(employee: :person)
      end

      def self.apply_filters(relation, filters)
        within_days = Integer(filters["within_days"].presence || 30)
        include_expired = ActiveModel::Type::Boolean.new.cast(filters.fetch("include_expired", true))

        end_date = Date.current + within_days.days
        scoped = relation.where.not(expires_on: nil)

        if include_expired
          scoped.where(expires_on: ..end_date)
        else
          scoped.where(expires_on: Date.current..end_date)
        end
      end

      def self.expiration_status(record)
        return "expired" if record.expired?
        return "expiring_soon" if record.expiring_soon?

        "valid"
      end
      private_class_method :expiration_status
    end
  end
end
