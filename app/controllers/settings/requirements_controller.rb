class Settings::RequirementsController < ApplicationController
  include Searchable

  expose :requirements, -> { policy_scope(search(Requirement::Requirement.includes_associated)) }
  expose :requirement, scope: -> { Requirement::Requirement.includes_associated }

  sortable_fields %w(name description requirement_type_id scope_type scope_id enforcement)

  strong_params :requirement, permit: [
    :name,
    :description,
    :requirement_type_id,
    :scope_type,
    :scope_id,
    :enforcement,
    { training_ids: [] },
    { credential_types: [] },
  ]

  # @route GET /settings/requirements (settings_requirements)
  def index
    authorize requirements

    paginated_requirements = paginate(requirements, :requirements)

    render inertia: "Settings/Requirements/Index", props: {
      requirements: -> { paginated_requirements.render(:index) },
      pagination: -> { {
        count: requirements.size,
        **pagination_data(paginated_requirements)
      } },
    }
  end

  # @route GET /settings/requirements/:id (settings_requirement)
  def show
    authorize requirement
    render inertia: "Settings/Requirements/Show", props: {
      requirement: -> { requirement.render(:show) }
    }
  end

  # @route GET /settings/requirements/new (new_settings_requirement)
  def new
    authorize Requirement::Requirement.new
    render inertia: "Settings/Requirements/New", props: {
      requirement: Requirement::Requirement.new.render(:form_data),
      requirement_type_options: -> { requirement_type_options },
      job_title_options: -> { job_title_options },
      client_options: -> { client_options },
      training_options: -> { training_options },
      credential_type_options: -> { credential_type_options },
    }
  end

  # @route GET /settings/requirements/:id/edit (edit_settings_requirement)
  def edit
    authorize requirement
    render inertia: "Settings/Requirements/Edit", props: {
      requirement: requirement.render(:edit),
      requirement_type_options: -> { requirement_type_options },
      job_title_options: -> { job_title_options },
      client_options: -> { client_options },
      training_options: -> { training_options },
      credential_type_options: -> { credential_type_options },
    }
  end

  # @route POST /settings/requirements (settings_requirements)
  def create
    attrs = normalized_requirement_attrs
    training_ids = attrs.delete(:training_ids)
    credential_types = attrs.delete(:credential_types)
    record = Requirement::Requirement.new(attrs)
    authorize record

    if record.save
      record.sync_training_ids!(training_ids)
      record.sync_credential_types!(credential_types)
      redirect_to settings_requirement_url(record), notice: t("templates.controllers.notices.created", model: "Requirement")
    else
      redirect_to new_settings_requirement_path, inertia: { errors: record.errors }
    end
  end

  # @route PATCH /settings/requirements/:id (settings_requirement)
  # @route PUT /settings/requirements/:id (settings_requirement)
  def update
    authorize requirement
    attrs = normalized_requirement_attrs
    training_ids = attrs.delete(:training_ids)
    credential_types = attrs.delete(:credential_types)

    if requirement.update(attrs)
      requirement.sync_training_ids!(training_ids)
      requirement.sync_credential_types!(credential_types)
      redirect_to settings_requirement_url(requirement), notice: t("templates.controllers.notices.updated", model: "Requirement")
    else
      redirect_to edit_settings_requirement_path(requirement), inertia: { errors: requirement.errors }
    end
  end

  # @route DELETE /settings/requirements/:id (settings_requirement)
  def destroy
    authorize requirement
    requirement.destroy!
    redirect_to settings_requirements_url, notice: t("templates.controllers.notices.destroyed", model: "Requirement")
  end

  private

  def normalized_requirement_attrs
    attrs = requirement_params.to_h.symbolize_keys
    attrs[:scope_type] = attrs[:scope_type].presence
    attrs[:scope_id] = attrs[:scope_id].presence
    attrs[:enforcement] = attrs[:enforcement].presence || "advisory"
    attrs
  end

  def requirement_type_options
    policy_scope(Requirement::Type).order(:name).render(:options)
  end

  def job_title_options
    Employee::JobTitle.order(:name).render(:options)
  end

  def client_options
    policy_scope(Client).includes(:person).filter_map do |client|
      name = client.name.presence
      next if name.blank?

      { id: client.id, name: name }
    end.sort_by { |option| option[:name].downcase }
  end

  def training_options
    policy_scope(Employee::Training).active.order(:name).render(:options)
  end

  def credential_type_options
    Employee::Credential.credential_types.keys.map do |key|
      {
        id: key,
        name: key.to_s.tr("_", " ").split.map(&:capitalize).join(" "),
      }
    end
  end
end
