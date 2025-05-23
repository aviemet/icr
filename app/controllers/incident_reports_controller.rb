class IncidentReportsController < ApplicationController
  include Searchable

  expose :incident_reports, -> { search(IncidentReport.includes_associated) }
  expose :incident_report, scope: ->{ IncidentReport }, find: ->(id, scope){ scope.includes_associated.find(id) }

  sortable_fields %w(occurred_at reported_by_id client_id reported_at agency_notified_at reported_to_id location)

  strong_params :incident_report, permit: [:occurred_at, :reported_by_id, :client_id, :reported_at, :agency_notified_at, :reported_to_id, :location]

  # @route GET /incident_reports (incident_reports)
  def index
    authorize incident_reports

    paginated_incident_reports = paginate(incident_reports, :incident_reports)

    render inertia: "IncidentReports/Index", props: {
      incident_reports: -> { paginated_incident_reports.render(:index) },
      pagination: -> { {
        count: incident_reports.count,
        **pagination_data(paginated_incident_reports)
      } }
    }
  end

  # @route GET /incident_reports/:id (incident_report)
  def show
    authorize incident_report
    render inertia: "IncidentReports/Show", props: {
      incident_report: -> { incident_report.render(:show) }
    }
  end

  # @route GET /incident_reports/new (new_incident_report)
  def new
    authorize IncidentReport.new
    render inertia: "IncidentReports/New", props: {
      incident_report: IncidentReport.new.render(:form_data)
    }
  end

  # @route GET /incident_reports/:id/edit (edit_incident_report)
  def edit
    authorize incident_report
    render inertia: "IncidentReports/Edit", props: {
      incident_report: incident_report.render(:edit)
    }
  end

  # @route POST /incident_reports (incident_reports)
  def create
    authorize IncidentReport.new
    if incident_report.save
      redirect_to incident_report, notice: t("templates.controllers.notices.created", model: "Incident report")
    else
      redirect_to new_incident_report_path, inertia: { errors: incident_report.errors }
    end
  end

  # @route PATCH /incident_reports/:id (incident_report)
  # @route PUT /incident_reports/:id (incident_report)
  def update
    authorize incident_report
    if incident_report.update(incident_report_params)
      redirect_to incident_report, notice: t("templates.controllers.notices.updated", model: "Incident report")
    else
      redirect_to edit_incident_report_path, inertia: { errors: incident_report.errors }
    end
  end

  # @route DELETE /incident_reports/:id (incident_report)
  def destroy
    authorize incident_report
    incident_report.destroy!
    redirect_to incident_reports_url, notice: t("templates.controllers.notices.destroyed", model: "Incident report")
  end
end
