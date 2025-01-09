require "active_support/concern"

module InertiaShare::Settings
  extend ActiveSupport::Concern

  included do
    inertia_share settings: -> { Setting.render }
  end
end
