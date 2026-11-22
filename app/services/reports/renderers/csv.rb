# frozen_string_literal: true

require "csv"

module Reports
  module Renderers
    class Csv
      def self.call(headers:, rows:)
        content = CSV.generate do |csv|
          csv << headers
          rows.each { |row| csv << row }
        end

        {
          content: content,
          content_type: "text/csv; charset=utf-8",
          extension: "csv",
        }
      end
    end
  end
end
