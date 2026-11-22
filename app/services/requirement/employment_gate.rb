# frozen_string_literal: true

module Requirement
  class EmploymentGate
    Result = Struct.new(:allowed, :unmet, keyword_init: true) do
      def allowed?
        allowed
      end

      def unmet_names
        unmet.map(&:name)
      end
    end

    def self.call(employee)
      new(employee).call
    end

    def initialize(employee)
      @employee = employee
    end

    def call
      requirements = ::Requirement::Requirement
        .for_employment_gate(@employee)
        .includes_associated
        .order(:name)
        .to_a

      fulfillment = FulfillmentForEmployee.call(@employee, requirements: requirements)
      unmet = fulfillment.unmet

      Result.new(allowed: unmet.empty?, unmet: unmet)
    end
  end
end
