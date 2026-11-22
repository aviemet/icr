# frozen_string_literal: true

module Requirement
  class ClientScheduleGate
    Result = Struct.new(:allowed, :unmet, keyword_init: true) do
      def allowed?
        allowed
      end

      def unmet_names
        unmet.map(&:name)
      end
    end

    def self.call(employee:, client:)
      new(employee: employee, client: client).call
    end

    def initialize(employee:, client:)
      @employee = employee
      @client = client
    end

    def call
      requirements = ::Requirement::Requirement
        .for_client_schedule_gate(@employee, @client)
        .includes_associated
        .order(:name)
        .to_a

      fulfillment = FulfillmentForEmployee.call(@employee, requirements: requirements)
      unmet = fulfillment.unmet

      Result.new(allowed: unmet.empty?, unmet: unmet)
    end
  end
end
