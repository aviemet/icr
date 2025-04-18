# == Schema Information
#
# Table name: roles
#
#  id            :uuid             not null, primary key
#  name          :string
#  resource_type :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  resource_id   :uuid
#
# Indexes
#
#  index_roles_on_name_and_resource_type_and_resource_id  (name,resource_type,resource_id)
#  index_roles_on_resource                                (resource_type,resource_id)
#
class Role < ApplicationRecord
  has_and_belongs_to_many :users, join_table: :users_roles

  belongs_to :resource,
    polymorphic: true,
    optional: true

  validates :resource_type,
    inclusion: { in: Rolify.resource_types },
    allow_nil: true

  scopify
  include PgSearch::Model

  pg_search_scope(
    :search,
    against: [],
    using: {
      tsearch: { prefix: true },
      trigram: {},
    },
  )

  resourcify

  scope :includes_associated, -> { includes([]) }

  # Define role groups
  scope :employee_roles, -> { where(resource_type: "JobTitle") }
  scope :client_roles, -> { where(resource_type: "Client") }
  scope :doctor_roles, -> { where(resource_type: "Doctor") }
  scope :vendor_roles, -> { where(resource_type: "Vendor") }
end
