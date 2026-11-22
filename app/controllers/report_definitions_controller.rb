# frozen_string_literal: true

class ReportDefinitionsController < ApplicationController
  expose :report_definitions, -> { policy_scope(ReportDefinition.system_reports.order(:name)) }
  expose :report_definition

  def index
    authorize ReportDefinition

    render inertia: "Reports/Definitions/Index", props: {
      report_definitions: -> { report_definitions.render(:index) },
    }
  end

  def show
    authorize report_definition

    render inertia: "Reports/Definitions/Show", props: {
      report_definition: -> { report_definition.render(:show) },
    }
  end
end
