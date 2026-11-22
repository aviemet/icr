# frozen_string_literal: true

module Reports
  class Enqueue
    def self.call(definition:, user:, params: {})
      new(definition: definition, user: user, params: params).call
    end

    def initialize(definition:, user:, params: {})
      @definition = definition
      @user = user
      @params = params.to_h.stringify_keys
    end

    def call
      request = ReportRequest.create!(
        report_definition: @definition,
        requested_by: @user,
        params: @params,
        definition_snapshot: @definition.snapshot,
        status: "pending",
      )
      Reports::GenerateJob.perform_later(request.id)
      request
    end
  end
end
