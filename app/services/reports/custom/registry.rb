# frozen_string_literal: true

module Reports
  module Custom
    class Registry
      GENERATORS = {
        "client_face_sheet" => Reports::Custom::ClientFaceSheet,
      }.freeze

      def self.generator_keys
        GENERATORS.keys
      end

      def self.generator(key)
        GENERATORS[key.to_s]
      end

      def self.registered?(key)
        GENERATORS.key?(key.to_s)
      end

      def self.fetch!(key)
        generator(key) || raise(ArgumentError, "Unknown custom report generator: #{key}")
      end
    end
  end
end
