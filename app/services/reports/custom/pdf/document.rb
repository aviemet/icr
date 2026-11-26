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
            margin: [36, 28, 36, 28],
          )
          draw_header
        end

        def section(heading)
          @pdf.move_down 6
          @pdf.text heading.to_s, style: :bold, size: 11
          @pdf.move_down 2
        end

        def field(label, value)
          @pdf.text "#{label}: #{value.presence || Base::BLANK}", size: 9
        end

        def fields(pairs)
          pairs.each do |label, value|
            field(label, value)
          end
        end

        def identity_block(pairs, portrait_path: nil)
          if portrait_path.blank?
            fields(pairs)
            return
          end

          portrait_width = 72
          gap = 10
          fields_width = @pdf.bounds.width - portrait_width - gap
          start_y = @pdf.cursor
          fields_bottom = start_y

          @pdf.bounding_box([0, start_y], width: fields_width) do
            fields(pairs)
            fields_bottom = @pdf.cursor
          end

          @pdf.bounding_box([fields_width + gap, start_y], width: portrait_width, height: 96) do
            @pdf.image portrait_path, fit: [portrait_width, 96], position: :center, vposition: :top
          end

          bottom = [fields_bottom, start_y - 96].min
          @pdf.move_cursor_to(bottom - 4)
        end

        def paragraph(text)
          @pdf.text text.to_s.presence || Base::BLANK, size: 9
        end

        def table(headers, rows)
          data = [headers] + rows
          @pdf.table(data, header: true, width: @pdf.bounds.width, cell_style: { size: 8, padding: 3 }) do
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
          @pdf.text Setting.company_name.to_s, size: 10, style: :bold
          @pdf.text @title.to_s, size: 14, style: :bold
          @pdf.move_down 6
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
