# == Schema Information
#
# Table name: requirement_types
#
#  id          :uuid             not null, primary key
#  description :text
#  name        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
module Requirement
  class Type < ApplicationRecord
    include PgSearchable
    pg_search_config(against: [:name, :description])

    tracked
    resourcify

    has_many(
      :requirements,
      class_name: "Requirement::Requirement",
      foreign_key: "requirement_type_id",
      inverse_of: :requirement_type,
      dependent: :restrict_with_error,
    )

    validates :name, presence: true

    scope :includes_associated, -> { includes([]) }
  end
end
