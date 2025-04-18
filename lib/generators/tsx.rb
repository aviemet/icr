require "rails/generators/named_base"

module Tsx
  module Generators
    class Base < Rails::Generators::NamedBase
      source_root File.expand_path("lib/templates/tsx/scaffold", Rails.root)

      private

      def formats
        [format]
      end

      def format
        :tsx
      end

      def filename_with_extensions(name, file_format = format)
        [name, file_format].compact.join(".")
      end
    end
  end
end
