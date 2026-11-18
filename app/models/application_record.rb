class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  self.implicit_order_column = "created_at"

  include Renderable

  has_paper_trail

  scope :includes_associated, -> { includes([]) }
end
