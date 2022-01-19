# frozen_string_literal: true

module Inertia
  module Generators
    class ScaffoldGenerator < Rails::Generators::NamedBase # :nodoc:
      include Rails::Generators::ResourceHelpers

      source_root File.expand_path("../templates", __dir__)

      remove_hook_for :resource_controller
      remove_class_option :actions

      class_option :assets, type: :boolean
      class_option :resource_route, type: :boolean

      hook_for :scaffold_controller, required: true

      hook_for :assets do |assets|
        invoke assets, [controller_name]
      end
    end
  end
end
