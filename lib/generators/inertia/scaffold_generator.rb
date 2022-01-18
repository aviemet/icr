module Inertia
  module Generators
    class ScaffoldGenerator < Rails::Generators::NamedBase
      remove_hook_for :resource_controller
      remove_class_option :actions

      class_option :api, type: :boolean
      class_option :assets, type: :boolean
      class_option :resource_route, type: :boolean

      hook_for :scaffold_controller, required: true

      hook_for :assets do |assets|
        invoke assets, [controller_name]
      end
    end
  end
end
