# frozen_string_literal: true

module FeatureFlagged
  extend ActiveSupport::Concern

  class_methods do
    def require_feature(feature_key, **)
      before_action(**) do
        next if Flipper.enabled?(feature_key, current_user)

        raise ActionController::RoutingError, "Not Found"
      end
    end
  end
end
