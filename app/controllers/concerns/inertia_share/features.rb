# frozen_string_literal: true

module InertiaShare::Features
  extend ActiveSupport::Concern

  included do
    inertia_share features: -> {
      {
        compliance_forms: Flipper.enabled?(:compliance_forms, current_user),
      }
    }
  end
end
