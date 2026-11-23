# frozen_string_literal: true

# == Schema Information
#
# Table name: report_definitions
#
#  id              :uuid             not null, primary key
#  aggregator_keys :jsonb            not null
#  columns         :jsonb            not null
#  default_filters :jsonb            not null
#  format          :string           default("xlsx"), not null
#  grouper_keys    :jsonb            not null
#  mode            :string           default("list"), not null
#  name            :string           not null
#  resource_key    :string           not null
#  slug            :string           not null
#  system          :boolean          default(FALSE), not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  created_by_id   :uuid
#
# Indexes
#
#  index_report_definitions_on_created_by_id  (created_by_id)
#  index_report_definitions_on_resource_key   (resource_key)
#  index_report_definitions_on_slug           (slug) UNIQUE
#  index_report_definitions_on_system         (system)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id)
#
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

    trait :client_face_sheet do
      sequence(:name) { |n| "Client Face Sheet #{n}" }
      sequence(:slug) { |n| "client-face-sheet-#{n}" }
      resource_key { "client_face_sheet" }
      mode { "custom" }
      format { "pdf" }
      columns { [] }
      default_filters { {} }
    end

  end
end
