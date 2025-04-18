class Employee::EmploymentStatus < ApplicationRecord
  include Categorizable

  include PgSearchable
  pg_search_config(
    against: [:name, :active_at, :inactive_at, :notes, :category, :order],
    associated_against: {
      employee: [:number],
      category: [:name],
    },
  )

  tracked
  resourcify

  belongs_to :employee
  belongs_to :updated_by, class_name: "Person"

  scope :includes_associated, -> { includes([:employee, :updated_by, :category]) }
end
