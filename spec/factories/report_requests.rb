# frozen_string_literal: true

FactoryBot.define do
  factory :report_request do
    report_definition
    requested_by factory: %i[user]
    status { "pending" }
    params { {} }
    definition_snapshot { report_definition.snapshot }
  end
end
