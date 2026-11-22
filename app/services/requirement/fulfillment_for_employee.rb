# frozen_string_literal: true

module Requirement
  class FulfillmentForEmployee
    ItemStatus = Struct.new(
      :fulfillable_id,
      :fulfillable_type,
      :credential_type,
      :kind,
      :name,
      :status,
      keyword_init: true,
    )

    RequirementStatus = Struct.new(
      :requirement_id,
      :name,
      :type_name,
      :scope_label,
      :enforcement,
      :status,
      :items,
      keyword_init: true,
    )

    Result = Struct.new(
      :requirements,
      :met_count,
      :unmet_count,
      :total_count,
      keyword_init: true,
    ) do
      def unmet
        requirements.select { |entry| entry.status == "unmet" }
      end

      def to_h
        {
          requirements: requirements.map { |entry| requirement_to_h(entry) },
          met_count: met_count,
          unmet_count: unmet_count,
          total_count: total_count,
        }
      end

      private

      def requirement_to_h(entry)
        {
          requirement_id: entry.requirement_id,
          name: entry.name,
          type_name: entry.type_name,
          scope_label: entry.scope_label,
          enforcement: entry.enforcement,
          status: entry.status,
          items: entry.items.map do |item|
            {
              fulfillable_id: item.fulfillable_id,
              fulfillable_type: item.fulfillable_type,
              credential_type: item.credential_type,
              kind: item.kind,
              name: item.name,
              status: item.status,
            }
          end,
        }
      end
    end

    def self.call(employee, requirements: nil)
      new(employee, requirements: requirements).call
    end

    def initialize(employee, requirements: nil)
      @employee = employee
      @requirements = requirements
    end

    def call
      requirements = load_requirements
      completed_training_ids = completed_training_id_set
      valid_credential_types = valid_credential_type_set

      statuses = requirements.map { |requirement|
        build_requirement_status(requirement, completed_training_ids, valid_credential_types)
      }
      met_count = statuses.count { |entry| entry.status == "met" }
      unmet_count = statuses.count { |entry| entry.status == "unmet" }

      Result.new(
        requirements: statuses,
        met_count: met_count,
        unmet_count: unmet_count,
        total_count: statuses.size,
      )
    end

    private

    def load_requirements
      return Array(@requirements) if @requirements

      ::Requirement::Requirement
        .applicable_to(@employee)
        .includes_associated
        .order(:name)
        .to_a
    end

    def completed_training_id_set
      Employee::EmployeesTraining
        .where(employee_id: @employee.id)
        .where.not(completed_at: nil)
        .pluck(:training_id)
        .to_set(&:to_s)
    end

    def valid_credential_type_set
      Employee::Credential
        .where(employee_id: @employee.id)
        .to_a
        .reject(&:expired?)
        .to_set(&:credential_type)
    end

    def build_requirement_status(requirement, completed_training_ids, valid_credential_types)
      items = requirement.requirement_items.map { |item|
        build_item_status(item, completed_training_ids, valid_credential_types)
      }
      status = items.all? { |item| item.status == "met" } ? "met" : "unmet"

      RequirementStatus.new(
        requirement_id: requirement.id,
        name: requirement.name,
        type_name: requirement.requirement_type&.name,
        scope_label: requirement.scope_label,
        enforcement: requirement.enforcement,
        status: status,
        items: items,
      )
    end

    def build_item_status(item, completed_training_ids, valid_credential_types)
      if item.credential?
        ItemStatus.new(
          fulfillable_id: nil,
          fulfillable_type: nil,
          credential_type: item.credential_type,
          kind: "credential",
          name: item.display_name,
          status: valid_credential_types.include?(item.credential_type) ? "met" : "unmet",
        )
      else
        ItemStatus.new(
          fulfillable_id: item.fulfillable_id,
          fulfillable_type: item.fulfillable_type,
          credential_type: nil,
          kind: "training",
          name: item.display_name,
          status: completed_training_ids.include?(item.fulfillable_id.to_s) ? "met" : "unmet",
        )
      end
    end
  end
end
