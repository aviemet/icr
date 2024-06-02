module Categorizable
  extend ActiveSupport::Concern

  included do
    before_validation :assign_default_category

    belongs_to :category

    scope :find_by_category, ->(type) { joins(:category).where("category.categorizable_type" => type.to_s.singularize.camelize) }

    def assign_default_category
      return unless category.nil?

      self.category = Category.find_by_type(self.class.to_s).where(name: "Other").first
    end
  end
end
