module Categorizable
  extend ActiveSupport::Concern

  included do
    belongs_to :category

    scope :find_by_category, ->(type) { joins(:category).where("category.categorizable_type" => type.to_s.singularize.camelize) }
  end
end
