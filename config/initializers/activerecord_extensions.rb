require_relative "../../lib/renderable"

module ActiveRecordExtensions
  extend ActiveSupport::Concern

  included do
    include Renderable::ClassMethods
  end
end

ActiveRecord::Relation.include ActiveRecordExtensions

# Tell AR to use the sublcass of STI models in polymorphic _type fields
ActiveRecord::Base.store_full_sti_class = false
