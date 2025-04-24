class RequirementsController < ApplicationController
  include Searchable

  expose :requirements, -> { search(Requirement::Requirement.new.includes_associated) }
  expose :requirement, scope: ->{ Requirement::Requirement.new.includes_associated }

  sortable_fields %w(name description requirement_type_id scope_type scope_id)

  strong_params :requirement, permit: [:name, :description, :requirement_type_id, :scope_type, :scope_id]

  # @route GET /requirements (requirements)
  def index
    authorize requirements

    paginated_requirements = paginate(requirements, :requirements)

    render inertia: "Requirement/Requirements/Index", props: {
      requirements: -> { paginated_requirements.render(:index) },
      pagination: -> { {
        count: requirements.size,
        **pagination_data(paginated_requirements)
      } },
    }
  end

  # @route GET /requirements/:id (requirement)
  def show
    authorize requirement
    render inertia: "Requirement/Requirements/Show", props: {
      requirement: -> { requirement.render(:show) }
    }
  end

  # @route GET /requirements/new (new_requirement)
  def new
    authorize Requirement::Requirement.new
    render inertia: "Requirement/Requirements/New", props: {
      requirement: Requirement::Requirement.new.render(:form_data)
    }
  end

  # @route GET /requirements/:id/edit (edit_requirement)
  def edit
    authorize requirement
    render inertia: "Requirement/Requirements/Edit", props: {
      requirement: requirement.render(:edit)
    }
  end

  # @route POST /requirements (requirements)
  def create
    authorize Requirement::Requirement.new
    if requirement.save
      redirect_to requirement, notice: "Requirement was successfully created."
    else
      redirect_to new_requirement_path, inertia: { errors: requirement.errors }
    end
  end

  # @route PATCH /requirements/:id (requirement)
  # @route PUT /requirements/:id (requirement)
  def update
    authorize requirement
    if requirement.update(requirement_params)
      redirect_to requirement, notice: "Requirement was successfully updated."
    else
      redirect_to edit_requirement_path, inertia: { errors: requirement.errors }
    end
  end

  # @route DELETE /requirements/:id (requirement)
  def destroy
    authorize requirement
    requirement.destroy!
    redirect_to requirements_url, notice: "Requirement was successfully destroyed."
  end
end
