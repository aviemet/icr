# frozen_string_literal: true

module Reports
  class Enqueue
    def self.call(definition:, user:, params: {}, perform_now: false)
      new(definition: definition, user: user, params: params, perform_now: perform_now).call
    end

    def initialize(definition:, user:, params: {}, perform_now: false)
      @definition = definition
      @user = user
      @params = params.to_h.stringify_keys
      @perform_now = perform_now
    end

    def call
      request = ReportRequest.create!(
        report_definition: @definition,
        requested_by: @user,
        params: @params,
        definition_snapshot: @definition.snapshot,
        status: "pending",
      )

      if @perform_now
        Reports::GenerateJob.perform_now(request.id)
        request.reload
      else
        Reports::GenerateJob.perform_later(request.id)
      end

      request
    end
  end
end
