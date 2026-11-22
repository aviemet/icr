# frozen_string_literal: true

class ReportRequestsController < ApplicationController
  expose :report_requests, -> {
    policy_scope(ReportRequest.includes(:report_definition, requested_by: :person).order(created_at: :desc))
  }
  expose :report_request

  def index
    authorize ReportRequest

    paginated_report_requests = paginate(report_requests, :report_requests)

    render inertia: "Reports/Queue/Index", props: {
      report_requests: -> { paginated_report_requests.render(:index) },
      pagination: -> { {
        count: report_requests.count,
        **pagination_data(paginated_report_requests),
      } },
    }
  end

  def create
    definition = ReportDefinition.find(params.require(:report_definition_id))
    authorize ReportRequest.new
    authorize definition, :show?

    Reports::Enqueue.call(
      definition: definition,
      user: current_user,
      params: request_params,
    )

    redirect_to report_requests_path, notice: t("templates.controllers.notices.created", model: "Report request")
  rescue ActiveRecord::RecordInvalid => e
    redirect_back_or_to report_definition_path(definition), inertia: { errors: e.record.errors }
  end

  def download
    authorize report_request, :download?

    unless report_request.status == "complete" && report_request.file.attached?
      redirect_to report_requests_path, alert: t("reports.not_ready")
      return
    end

    redirect_to rails_blob_path(report_request.file, disposition: "attachment")
  end

  private

  def request_params
    params.fetch(:report_request, {}).permit(:within_days, :include_expired).to_h
  end
end
