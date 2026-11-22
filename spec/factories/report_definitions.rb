# frozen_string_literal: true

FactoryBot.define do
  factory :report_definition do
    sequence(:name) { |n| "Report #{n}" }
    sequence(:slug) { |n| "report-#{n}" }
    resource_key { "employee_credential" }
    mode { "list" }
    format { "xlsx" }
    columns do
      %w[
        employee_name
        employee_number
        credential_name
        credential_type
        issued_on
        expires_on
        status
      ]
    end
    default_filters { { "within_days" => 30, "include_expired" => true } }
    grouper_keys { [] }
    aggregator_keys { [] }
    system { true }
  end
end
