# frozen_string_literal: true

require "prawn"
require "prawn/table"

module Reports
  module Custom
    module Pdf
      class Document
        def self.build(title:, user:, &block)
          document = new(title: title, user: user)
          yield document
          document.render
        end

        def initialize(title:, user:)
          @title = title
          @user = user
          @pdf = Prawn::Document.new(
            page_size: "LETTER",
            margin: [48, 36, 48, 36],
          )
          draw_header
        end

        def section(heading)
          @pdf.move_down 10
          @pdf.text heading.to_s, style: :bold, size: 12
          @pdf.move_down 4
        end

        def field(label, value)
          @pdf.text "#{label}: #{value.presence || Base::BLANK}", size: 10
        end

        def fields(pairs)
          pairs.each do |label, value|
            field(label, value)
          end
        end

        def paragraph(text)
          @pdf.text text.to_s.presence || Base::BLANK, size: 10
        end

        def table(headers, rows)
          data = [headers] + rows
          @pdf.table(data, header: true, width: @pdf.bounds.width, cell_style: { size: 9, padding: 4 }) do
            row(0).font_style = :bold
          end
        end

        def start_new_page
          @pdf.start_new_page
          draw_header
        end

        def render
          install_footer
          @pdf.render
        end

        private

        def draw_header
          @pdf.text Setting.company_name.to_s, size: 11, style: :bold
          @pdf.text @title.to_s, size: 16, style: :bold
          @pdf.move_down 8
        end

        def install_footer
          name = @user.person&.name.presence || @user.email
          line = "Printed by: #{name} on #{I18n.l(Time.current.to_date)}"
          @pdf.number_pages(
            "#{line}    <page> of <total>",
            at: [@pdf.bounds.left, 0],
            width: @pdf.bounds.width,
            align: :left,
            size: 8,
          )
        end
      end
    end
  end
end
