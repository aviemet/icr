class Compliance::CorrectiveActionsController < ApplicationController
  require_feature :compliance_forms

  expose :form_submission, model: Compliance::FormSubmission, id: -> { params[:form_submission_id] }
  expose :corrective_action, model: Compliance::CorrectiveAction, scope: -> { form_submission.corrective_actions }

  strong_params :corrective_action, permit: [
    :description,
    :root_cause,
    :remedy,
    :due_on,
    :incident_report_id,
  ]

  # @route POST /compliance/form_submissions/:form_submission_id/corrective_actions (compliance_form_submission_corrective_actions)
  def create
    authorize form_submission, :update?
    corrective_action.assign_attributes(corrective_action_params)
    if corrective_action.save
      redirect_to compliance_form_submission_path(form_submission), notice: t("templates.controllers.notices.created", model: "Corrective action")
    else
      redirect_to compliance_form_submission_path(form_submission), inertia: { errors: corrective_action.errors }
    end
  end

  # @route PATCH /compliance/form_submissions/:form_submission_id/corrective_actions/:id (compliance_form_submission_corrective_action)
  # @route PUT /compliance/form_submissions/:form_submission_id/corrective_actions/:id (compliance_form_submission_corrective_action)
  def update
    authorize corrective_action
    if corrective_action.update(corrective_action_params)
      redirect_to compliance_form_submission_path(form_submission), notice: t("templates.controllers.notices.updated", model: "Corrective action")
    else
      redirect_to compliance_form_submission_path(form_submission), inertia: { errors: corrective_action.errors }
    end
  end

  # @route POST /compliance/form_submissions/:form_submission_id/corrective_actions/:id/close (close_compliance_form_submission_corrective_action)
  def close
    authorize corrective_action, :close?
    corrective_action.close!
    redirect_to compliance_form_submission_path(form_submission), notice: t("templates.controllers.notices.updated", model: "Corrective action")
  end
end
