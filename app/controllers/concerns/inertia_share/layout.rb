require "active_support/concern"

module InertiaShare::Layout
  extend ActiveSupport::Concern

  LAYOUTS = {
    default: "AppLayout",
    auth: "AuthLayout",
    public: "PublicLayout",
  }.freeze

  included do
    inertia_share layout: -> { layout_value }
  end

  protected

  def layout_value
    LAYOUTS[:default]
  end

  def set_inertia_layout(layout_value)
    unless LAYOUTS.values?(layout_value)
      raise ArgumentError, "Invalid layout: #{layout_value}. Valid layouts are: #{LAYOUTS.values.join(', ')}"
    end

    inertia_share layout: layout_value
  end
end
