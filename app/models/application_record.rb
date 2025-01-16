class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  self.implicit_order_column = "created_at"

  # Add .render method to ActiveRecord objects. Located in app/lib/renderable
  include Renderable

  include PublicActivity::Model
  tracked owner: proc { |controller, _model| controller&.current_user || nil }

  scope :includes_associated, -> { includes([]) }
end
