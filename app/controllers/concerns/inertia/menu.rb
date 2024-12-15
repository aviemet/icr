require "active_support/concern"

module Inertia::Menu
  extend ActiveSupport::Concern

  included do
    inertia_share do
      share_object = {
        menu: nil,
      }

      if current_user
        share_object[:menu] = {}
      end

      share_object
    end
  end
end
