require_relative "../../../lib/renderable"

# For use on models which don't inherit from ActiveRecord
# Renderable is applied to all ActiveRecord models through an initializer
module Renderable
  extend ActiveSupport::Concern

  included do
    include Renderable::ClassMethods
  end
end
