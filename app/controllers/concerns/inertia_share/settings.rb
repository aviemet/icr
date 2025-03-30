require "active_support/concern"

module InertiaShare::Settings
  extend ActiveSupport::Concern

  included do
    inertia_share settings: lambda {
      if current_user
        Setting.render
      else
        Setting.render(:public)
      end
    }
  end
end
