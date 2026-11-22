# frozen_string_literal: true

require "caxlsx"

module Reports
  module Renderers
    class Xlsx
      def self.call(headers:, rows:)
        package = Axlsx::Package.new
        workbook = package.workbook
        workbook.add_worksheet(name: "Report") do |sheet|
          sheet.add_row(headers)
          rows.each { |row| sheet.add_row(row) }
        end

        {
          content: package.to_stream.read,
          content_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          extension: "xlsx",
        }
      end
    end
  end
end
