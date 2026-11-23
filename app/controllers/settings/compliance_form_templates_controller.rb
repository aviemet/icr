class Settings::ComplianceFormTemplatesController < ApplicationController
  require_feature :compliance_forms

  expose :form_templates, -> { policy_scope(Compliance::FormTemplate.includes_associated.order(:name)) }
  expose :form_template,
         model: Compliance::FormTemplate,
         id: -> { params[:slug] },
         scope: -> { Compliance::FormTemplate.includes_associated },
         find_by: :slug

  strong_params :form_template, permit: [
    :name,
    :description,
    :cadence,
    :subject_type,
    :active,
  ]

  # @route GET /settings/compliance_form_templates (settings_compliance_form_templates)
  def index
    authorize Compliance::FormTemplate
    render inertia: "Settings/ComplianceFormTemplates/Index", props: {
      form_templates: -> { form_templates.render(:index) },
    }
  end

  # @route GET /settings/compliance_form_templates/:slug (settings_compliance_form_template)
  def show
    authorize form_template
    render inertia: "Settings/ComplianceFormTemplates/Show", props: {
      form_template: -> { form_template.render(:show) },
    }
  end

  # @route PATCH /settings/compliance_form_templates/:slug (settings_compliance_form_template)
  # @route PUT /settings/compliance_form_templates/:slug (settings_compliance_form_template)
  def update
    authorize form_template
    if form_template.update(form_template_params)
      redirect_to settings_compliance_form_template_path(form_template), notice: t("templates.controllers.notices.updated", model: "Form template")
    else
      redirect_to settings_compliance_form_template_path(form_template), inertia: { errors: form_template.errors }
    end
  end
end
