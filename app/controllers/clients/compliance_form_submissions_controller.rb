class Clients::ComplianceFormSubmissionsController < Clients::BaseController
  require_feature :compliance_forms

  expose :form_submission, model: Compliance::FormSubmission, scope: -> { Compliance::FormSubmission.all }

  # @route POST /clients/:client_slug/compliance_form_submissions (client_compliance_form_submissions)
  def create
    template = Compliance::FormTemplate.active.find_by(slug: Compliance::HazardAssessmentSeed::TEMPLATE_SLUG)
    if template.blank?
      redirect_to client_path(client, tab: "compliance"), alert: t("compliance.alerts.hazard_template_missing")
      return
    end

    existing = open_submission_for_client(template)
    if existing.present?
      authorize existing, :show?
      redirect_to edit_compliance_form_submission_path(existing)
      return
    end

    submission = Compliance::FormSubmission.new(
      form_template: template,
      household: client.household,
      client: client,
      conducted_by: current_user.person&.employee,
      inspected_on: Date.current,
      due_on: Date.current,
      status: :draft,
      started_via: started_via_param,
      template_version: template.form_version,
    )
    authorize submission

    if submission.save
      redirect_to edit_compliance_form_submission_path(submission), notice: t("templates.controllers.notices.created", model: "Inspection")
    else
      redirect_to client_path(client, tab: "compliance"), inertia: { errors: submission.errors }
    end
  end

  private

  def open_submission_for_client(template)
    scope = template.form_submissions.incomplete
    household = client.household
    if household.present?
      scope.find_by(household_id: household.id) || scope.find_by(client_id: client.id)
    else
      scope.find_by(client_id: client.id)
    end
  end

  def started_via_param
    allowed = Compliance::FormSubmission.started_via.keys
    value = params[:started_via].to_s
    return value if allowed.include?(value)

    "manual"
  end
end
