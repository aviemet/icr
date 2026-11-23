# frozen_string_literal: true

class ReportDefinitionsController < ApplicationController
  expose :report_definitions, -> {
    policy_scope(ReportDefinition.system_reports.catalog.order(:name))
  }
  expose :report_definition

  # @route GET /reports (report_definitions)
  def index
    authorize ReportDefinition

    render inertia: "Reports/Definitions/Index", props: {
      report_definitions: -> { report_definitions.render(:index) },
    }
  end

  # @route GET /reports/:id (report_definition)
  def show
    authorize report_definition

    render inertia: "Reports/Definitions/Show", props: {
      report_definition: -> { report_definition.render(:show) },
    }
  end
end
