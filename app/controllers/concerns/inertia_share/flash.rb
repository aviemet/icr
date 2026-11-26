require "active_support/concern"

module InertiaShare::Flash
  extend ActiveSupport::Concern

  included do
    add_flash_types :success, :error, :warning

    inertia_share flash: -> { {
      success: flash[:success], # green
      alert: flash[:alert].presence || flash[:error], # red
      info: flash[:notice], # blue
      warning: flash[:warning] # yellow
    } }
  end
end
