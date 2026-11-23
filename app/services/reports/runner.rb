# frozen_string_literal: true

module Reports
  class Runner
    def self.call(report_request)
      new(report_request).call
    end

    def initialize(report_request)
      @report_request = report_request
      @snapshot = report_request.definition_snapshot.stringify_keys
      @user = report_request.requested_by
    end

    def call
      @report_request.mark_processing!
      payload = if @snapshot.fetch("mode") == "custom"
                  run_custom
                else
                  run_tabular
                end
      attach_file(payload)
      @report_request.mark_complete!
      @report_request
    rescue StandardError => e
      @report_request.mark_failed!(e.message)
      @report_request
    end

    private

    def merged_filters
      defaults = (@snapshot["default_filters"] || {}).stringify_keys
      overrides = (@report_request.params || {}).stringify_keys
      defaults.merge(overrides)
    end

    def run_custom
      generator = Custom::Registry.fetch!(@snapshot.fetch("resource_key"))
      result = generator.call(
        user: @user,
        params: merged_filters,
        snapshot: @snapshot,
      )
      {
        content: result.fetch(:content),
        content_type: result.fetch(:content_type),
        filename: result[:filename],
        extension: result[:extension],
      }
    end

    def run_tabular
      resource = Catalog.fetch!(@snapshot.fetch("resource_key"))
      column_keys = Array(@snapshot.fetch("columns")).map(&:to_s)
      filters = merged_filters
      rows = build_rows(resource, column_keys, filters)
      headers = resource.headers(column_keys)
      render_payload(headers, rows)
    end

    def build_rows(resource, column_keys, filters)
      mode = @snapshot.fetch("mode")
      case mode
      when "list"
        relation = resource.apply_filters(resource.policy_scope(@user), filters)
        relation.find_each.map { |record| resource.row_values(record, column_keys) }
      when "aggregate"
        raise NotImplementedError, "Aggregate mode requires an active_reporter mapping for #{resource.key}"
      else
        raise ArgumentError, "Unknown report mode: #{mode}"
      end
    end

    def render_payload(headers, rows)
      format = @snapshot.fetch("format")
      case format
      when "xlsx"
        Renderers::Xlsx.call(headers: headers, rows: rows)
      when "csv"
        Renderers::Csv.call(headers: headers, rows: rows)
      else
        raise ArgumentError, "Unknown report format: #{format}"
      end
    end

    def attach_file(payload)
      filename = payload[:filename].presence || default_filename(payload)
      @report_request.file.attach(
        io: StringIO.new(payload.fetch(:content)),
        filename: filename,
        content_type: payload.fetch(:content_type),
      )
    end

    def default_filename(payload)
      [
        @snapshot.fetch("slug"),
        Time.current.strftime("%Y%m%d-%H%M%S"),
        payload.fetch(:extension),
      ].join(".")
    end
  end
end
