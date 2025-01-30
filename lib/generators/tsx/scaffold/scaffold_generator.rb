# frozen_string_literal: true

require_relative "../../tsx"
require "rails/generators/resource_helpers"

module Tsx
  module Generators
    class ScaffoldGenerator < Rails::Generators::NamedBase
      include Rails::Generators::ResourceHelpers

      source_root File.expand_path("lib/templates/tsx/scaffold", Rails.root)

      argument :attributes, type: :array, default: [], banner: "field:type field:type"

      def create_root_folder
        empty_directory File.join(views_path, controller_file_path.camelize).gsub("::", "/")
      end

      def copy_view_files
        available_views.each do |view|
          filename = "#{view}.tsx"
          template filename, File.join(views_path, controller_file_path.camelize, filename).gsub("::", "/")
        end
      end

      private

      def views_path
        "app/frontend/Pages"
      end

      def available_views
        %w(Index/index Edit/index Show/index New/index Form Table)
      end
    end
  end
end
