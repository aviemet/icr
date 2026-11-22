# == Schema Information
#
# Table name: requirements
#
#  id                  :uuid             not null, primary key
#  description         :text
#  enforcement         :integer          default("advisory"), not null
#  name                :string
#  scope_type          :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  requirement_type_id :uuid             not null
#  scope_id            :uuid
#
# Indexes
#
#  index_requirements_on_enforcement          (enforcement)
#  index_requirements_on_requirement_type_id  (requirement_type_id)
#  index_requirements_on_scope                (scope_type,scope_id)
#
# Foreign Keys
#
#  fk_rails_...  (requirement_type_id => requirement_types.id)
#
module Requirement
  class Requirement < ApplicationRecord
    self.table_name = "requirements"

    ALLOWED_SCOPE_TYPES = ["Employee::JobTitle", "Client"].freeze

    resourcify

    belongs_to :requirement_type, class_name: "Requirement::Type"
    belongs_to :scope, polymorphic: true, optional: true

    has_many :requirement_items, class_name: "Requirement::Item", dependent: :destroy, inverse_of: :requirement

    has_many :trainings,
             through: :requirement_items,
             source: :fulfillable,
             source_type: "Employee::Training"

    enum :enforcement, {
      advisory: 0,
      employment: 1,
      client_schedule: 2,
    }

    validates :name, presence: true
    validate :scope_type_allowed
    validate :enforcement_matches_scope

    scope :includes_associated, -> {
      includes(:requirement_type, :scope, requirement_items: :fulfillable)
    }

    scope :company_wide, -> { where(scope_type: nil, scope_id: nil) }

    scope :for_job_title, ->(job_title) {
      where(scope_type: "Employee::JobTitle", scope_id: job_title.id)
    }

    scope :for_client, ->(client) {
      where(scope_type: "Client", scope_id: client.id)
    }

    def self.job_title_for(employee)
      employee.job_title || employee.desired_job_title
    end

    def self.applicable_to(employee)
      scopes = [company_wide]
      job_title = job_title_for(employee)
      scopes << for_job_title(job_title) if job_title

      client_ids = employee.active_clients_attendants.map(&:client_id)
      scopes << where(scope_type: "Client", scope_id: client_ids) if client_ids.any?

      scopes.reduce { |relation, scope| relation.or(scope) }
    end

    def self.for_employment_gate(employee)
      scopes = [company_wide.employment]
      job_title = job_title_for(employee)
      scopes << for_job_title(job_title).employment if job_title

      scopes.reduce { |relation, scope| relation.or(scope) }
    end

    def self.for_client_schedule_gate(_employee, client)
      for_client(client).client_schedule
    end

    def training_ids
      requirement_items.trainings.pluck(:fulfillable_id)
    end

    def credential_types
      requirement_items.credentials.filter_map(&:credential_type)
    end

    def sync_training_ids!(ids)
      normalized_ids = Array(ids).filter_map { |entry| entry.to_s.presence }.uniq
      existing_items = requirement_items.trainings.to_a
      existing_by_id = existing_items.index_by { |item| item.fulfillable_id.to_s }

      existing_items.each do |item|
        item.destroy! unless normalized_ids.include?(item.fulfillable_id.to_s)
      end

      normalized_ids.each do |training_id|
        next if existing_by_id.key?(training_id)

        requirement_items.create!(
          fulfillable_type: "Employee::Training",
          fulfillable_id: training_id,
        )
      end
    end

    def sync_credential_types!(types)
      normalized = Array(types).filter_map { |entry| entry.to_s.presence }.uniq
      allowed = Employee::Credential.credential_types.keys
      normalized = normalized.select { |value| allowed.include?(value) }

      existing_items = requirement_items.credentials.to_a
      existing_by_type = existing_items.index_by(&:credential_type)

      existing_items.each do |item|
        item.destroy! unless normalized.include?(item.credential_type)
      end

      normalized.each do |credential_type|
        next if existing_by_type.key?(credential_type)

        requirement_items.create!(credential_type: credential_type)
      end
    end

    def scope_label
      return "Company-wide" if scope.blank?
      return scope.name if scope.respond_to?(:name)

      scope.to_s
    end

    private

    def scope_type_allowed
      if scope_type.blank? && scope_id.blank?
        return
      end

      if scope_type.present? && scope_id.blank?
        errors.add(:scope_id, "must be present when scope type is set")
        return
      end

      if scope_id.present? && scope_type.blank?
        errors.add(:scope_type, "must be present when scope id is set")
        return
      end

      return if ALLOWED_SCOPE_TYPES.include?(scope_type)

      errors.add(:scope_type, "is not supported")
    end

    def enforcement_matches_scope
      if client_schedule? && scope_type != "Client"
        errors.add(:enforcement, "client schedule requires a client scope")
      end

      if employment? && scope_type == "Client"
        errors.add(:enforcement, "employment cannot be scoped to a client")
      end
    end
  end
end
