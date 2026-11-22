class Settings::RequirementTypesController < ApplicationController
  include Searchable

  expose :requirement_types, -> { policy_scope(search(Requirement::Type.includes_associated)) }
  expose :requirement_type,
    model: Requirement::Type,
    scope: -> { Requirement::Type.includes_associated }

  sortable_fields %w(name description)

  strong_params :requirement_type, permit: [:name, :description]

  # @route GET /settings/requirement_types (settings_requirement_types)
  def index
    authorize requirement_types

    paginated_types = paginate(requirement_types, :requirement_types)

    render inertia: "Settings/RequirementTypes/Index", props: {
      requirement_types: -> { paginated_types.render(:index) },
      pagination: -> { {
        count: requirement_types.size,
        **pagination_data(paginated_types)
      } },
    }
  end

  # @route GET /settings/requirement_types/:id (settings_requirement_type)
  def show
    authorize requirement_type
    render inertia: "Settings/RequirementTypes/Show", props: {
      requirement_type: -> { requirement_type.render(:show) }
    }
  end

  # @route GET /settings/requirement_types/new (new_settings_requirement_type)
  def new
    authorize Requirement::Type.new
    render inertia: "Settings/RequirementTypes/New", props: {
      requirement_type: Requirement::Type.new.render(:form_data)
    }
  end

  # @route GET /settings/requirement_types/:id/edit (edit_settings_requirement_type)
  def edit
    authorize requirement_type
    render inertia: "Settings/RequirementTypes/Edit", props: {
      requirement_type: requirement_type.render(:edit)
    }
  end

  # @route POST /settings/requirement_types (settings_requirement_types)
  def create
    authorize Requirement::Type.new
    requirement_type.assign_attributes(requirement_type_params)
    if requirement_type.save
      redirect_to settings_requirement_type_url(requirement_type), notice: t("templates.controllers.notices.created", model: "Requirement Type")
    else
      redirect_to new_settings_requirement_type_path, inertia: { errors: requirement_type.errors }
    end
  end

  # @route PATCH /settings/requirement_types/:id (settings_requirement_type)
  # @route PUT /settings/requirement_types/:id (settings_requirement_type)
  def update
    authorize requirement_type
    if requirement_type.update(requirement_type_params)
      redirect_to settings_requirement_type_url(requirement_type), notice: t("templates.controllers.notices.updated", model: "Requirement Type")
    else
      redirect_to edit_settings_requirement_type_path(requirement_type), inertia: { errors: requirement_type.errors }
    end
  end

  # @route DELETE /settings/requirement_types/:id (settings_requirement_type)
  def destroy
    authorize requirement_type
    requirement_type.destroy!
    redirect_to settings_requirement_types_url, notice: t("templates.controllers.notices.destroyed", model: "Requirement Type")
  end
end
