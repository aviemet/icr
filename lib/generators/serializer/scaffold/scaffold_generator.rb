# frozen_string_literal: true

require_relative "../../serializer"
require "rails/generators/resource_helpers"

module Serializer
  module Generators
    class ScaffoldGenerator < Rails::Generators::NamedBase
      include Rails::Generators::ResourceHelpers

      argument :attributes, type: :array, default: [], banner: "field:type field:type"

      def create_root_folder
        empty_directory File.join(views_path, controller_file_path.camelize)
      end

      def copy_view_files
        Rails.logger.debug "SERIALIZERS"
      end

      private

      def views_path
        "app/serializers"
      end

      def available_views
        ""
      end
    end
  end
end
