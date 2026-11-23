class Compliance::FormSubmissionsController < ApplicationController
  require_feature :compliance_forms

  expose :form_submissions, -> {
    policy_scope(Compliance::FormSubmission.includes_associated)
  }
  expose :form_submission, model: Compliance::FormSubmission, scope: -> { Compliance::FormSubmission.includes_associated }

  strong_params :form_submission, permit: [
    :form_template_id,
    :household_id,
    :client_id,
    :conducted_by_id,
    :inspected_on,
    :due_on,
    :started_via,
    :status,
    {
      form_answers_attributes: [
        :id,
        :form_item_id,
        :check_value,
        :text_value,
        :date_value,
      ],
    },
    {
      corrective_actions_attributes: [
        :id,
        :description,
        :root_cause,
        :remedy,
        :due_on,
        :incident_report_id,
        :closed_at,
        :_destroy,
      ],
    },
  ]

  # @route GET /compliance/form_submissions (compliance_form_submissions)
  def index
    authorize Compliance::FormSubmission
    Compliance::EnsureDueSubmissions.call

    scoped = form_submissions
    tab = params[:tab].presence || "due"
    scoped = filter_by_tab(scoped, tab)
    paginated = paginate(scoped.order(Arel.sql("due_on ASC NULLS LAST"), created_at: :asc), :form_submissions)

    render inertia: "Compliance/FormSubmissions/Index", props: {
      form_submissions: -> { paginated.render(:index) },
      tab: tab,
      pagination: -> { {
        count: scoped.count,
        **pagination_data(paginated),
      } },
      counts: -> { tab_counts },
    }
  end

  # @route GET /compliance/form_submissions/:id (compliance_form_submission)
  def show
    authorize form_submission
    render inertia: "Compliance/FormSubmissions/Show", props: {
      form_submission: -> { form_submission.render(:show) },
    }
  end

  # @route GET /compliance/form_submissions/:id/edit (edit_compliance_form_submission)
  def edit
    authorize form_submission
    render inertia: "Compliance/FormSubmissions/Edit", props: {
      form_submission: -> { form_submission.render(:edit) },
    }
  end

  # @route PATCH /compliance/form_submissions/:id (compliance_form_submission)
  # @route PUT /compliance/form_submissions/:id (compliance_form_submission)
  def update
    authorize form_submission
    if form_submission.update(sanitized_form_submission_params)
      redirect_to compliance_form_submission_path(form_submission), notice: t("templates.controllers.notices.updated", model: "Inspection")
    else
      redirect_to edit_compliance_form_submission_path(form_submission), inertia: { errors: form_submission.errors }
    end
  end

  # @route POST /compliance/form_submissions/:id/submit (submit_compliance_form_submission)
  def submit
    authorize form_submission, :submit?
    form_submission.submit!
    redirect_to compliance_form_submission_path(form_submission), notice: t("templates.controllers.notices.updated", model: "Inspection")
  rescue ActiveRecord::RecordInvalid
    redirect_to edit_compliance_form_submission_path(form_submission), inertia: { errors: form_submission.errors }
  end

  # @route POST /compliance/form_submissions/:id/close (close_compliance_form_submission)
  def close
    authorize form_submission, :close?
    form_submission.close!
    redirect_to compliance_form_submission_path(form_submission), notice: t("templates.controllers.notices.updated", model: "Inspection")
  rescue ActiveRecord::RecordInvalid
    redirect_to compliance_form_submission_path(form_submission), inertia: { errors: form_submission.errors }
  end

  private

  def sanitized_form_submission_params
    attrs = form_submission_params.to_h
    answers = Array(attrs["form_answers_attributes"] || attrs[:form_answers_attributes])
    attrs["form_answers_attributes"] = answers.filter_map do |answer|
      next if answer.blank?

      row = answer.to_h.stringify_keys
      row.delete("id") if row["id"].blank?
      %w[check_value text_value date_value].each do |key|
        row[key] = nil if row[key].blank?
      end
      next if row["form_item_id"].blank?

      row
    end
    attrs
  end

  def filter_by_tab(scope, tab)
    case tab
    when "overdue"
      scope.open_statuses.where.not(due_on: nil).where(due_on: ...Date.current)
    when "open_actions"
      scope.joins(:corrective_actions).merge(Compliance::CorrectiveAction.open_actions).distinct
    when "submitted"
      scope.where(status: :submitted)
    when "all"
      scope
    else
      scope.open_statuses.where("due_on IS NULL OR due_on <= ?", Date.current)
    end
  end

  def tab_counts
    base = policy_scope(Compliance::FormSubmission)
    {
      due: base.open_statuses.where("due_on IS NULL OR due_on <= ?", Date.current).count,
      overdue: base.open_statuses.where.not(due_on: nil).where(due_on: ...Date.current).count,
      open_actions: base.joins(:corrective_actions).merge(Compliance::CorrectiveAction.open_actions).distinct.count,
      submitted: base.where(status: :submitted).count,
      all: base.count,
    }
  end
end
