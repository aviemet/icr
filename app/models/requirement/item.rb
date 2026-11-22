# == Schema Information
#
# Table name: requirement_items
#
#  id               :uuid             not null, primary key
#  credential_type  :integer
#  fulfillable_type :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  fulfillable_id   :uuid
#  requirement_id   :uuid             not null
#
# Indexes
#
#  index_req_items_on_req_credential_type_unique  (requirement_id,credential_type) UNIQUE WHERE (credential_type IS NOT NULL)
#  index_req_items_on_req_fulfillable_unique      (requirement_id,fulfillable_type,fulfillable_id) UNIQUE WHERE (fulfillable_id IS NOT NULL)
#  index_requirement_items_on_fulfillable         (fulfillable_type,fulfillable_id)
#  index_requirement_items_on_requirement_id      (requirement_id)
#
# Foreign Keys
#
#  fk_rails_...  (requirement_id => requirements.id)
#
module Requirement
  class Item < ApplicationRecord
    FULFILLABLE_TYPES = ["Employee::Training"].freeze

    include PgSearchable

    pg_search_config(
      against: [:requirement, :fulfillable],
      associated_against: {
        requirement: [],
        fulfillable: [],
      },
    )

    resourcify

    belongs_to :requirement, class_name: "Requirement::Requirement"
    belongs_to :fulfillable, polymorphic: true, optional: true

    enum :credential_type, Employee::Credential.credential_types, prefix: true

    validates :fulfillable_id, uniqueness: { scope: [:requirement_id, :fulfillable_type] }, if: -> { fulfillable_id.present? }
    validates :credential_type, uniqueness: { scope: :requirement_id }, if: -> { credential_type.present? }
    validates :fulfillable_type, inclusion: { in: FULFILLABLE_TYPES }, if: -> { fulfillable_type.present? }
    validate :exactly_one_criterion

    scope :includes_associated, -> { includes([:requirement, :fulfillable]) }
    scope :trainings, -> { where(fulfillable_type: "Employee::Training") }
    scope :credentials, -> { where.not(credential_type: nil) }

    def training?
      fulfillable_type == "Employee::Training" && fulfillable_id.present?
    end

    def credential?
      credential_type.present?
    end

    def display_name
      if training?
        return fulfillable.name if fulfillable.respond_to?(:name)

        "Training"
      elsif credential?
        credential_type.to_s.tr("_", " ").split.map(&:capitalize).join(" ")
      else
        "Requirement item"
      end
    end

    private

    def exactly_one_criterion
      has_training = fulfillable_id.present? || fulfillable_type.present?
      has_credential = credential_type.present?

      if has_training && has_credential
        errors.add(:base, "must be either a training or a credential type")
        return
      end

      return if has_training ^ has_credential

      errors.add(:base, "must include a training or a credential type")
    end
  end
end
