require "active_support/concern"

module InertiaShare::Auth
  extend ActiveSupport::Concern

  included do
    inertia_share auth: lambda { {
      user: current_user&.render(:inertia_share)
    } }
  end
end
