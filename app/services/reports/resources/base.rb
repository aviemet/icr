# frozen_string_literal: true

module Reports
  module Resources
    class Base
      def self.key
        raise NotImplementedError
      end

      def self.columns
        raise NotImplementedError
      end

      def self.filters
        {}
      end

      def self.column_keys
        columns.keys.map(&:to_s)
      end

      def self.filter_keys
        filters.keys.map(&:to_s)
      end

      def self.column_label(key)
        columns.fetch(key.to_s).fetch(:label)
      end

      def self.extract_column(record, key)
        columns.fetch(key.to_s).fetch(:extractor).call(record)
      end

      def self.policy_scope(user)
        raise NotImplementedError
      end

      def self.apply_filters(relation, _filters)
        relation
      end

      def self.headers(column_keys)
        column_keys.map { |key| column_label(key) }
      end

      def self.row_values(record, column_keys)
        column_keys.map { |key| extract_column(record, key) }
      end
    end
  end
end
