class Requirement::RequirementsController < ApplicationController
  include Searchable
  
  expose :requirement_requirements, -> { search(Requirement::Requirement.new.includes_associated) }
  expose :requirement_requirement, scope: ->{ Requirement::Requirement.new.includes_associated }
  
  sortable_fields %w(name description requirement_type_id scope_type scope_id)

  strong_params :requirement_requirement, permit: [:name, :description, :requirement_type_id, :scope_type, :scope_id]

  def index
    authorize requirement_requirements

    paginated_requirement_requirements = paginate(requirement_requirements, :requirement_requirements)
    
    render inertia: "Requirement/Requirements/Index", props: {
      requirement_requirements: -> { paginated_requirement_requirements.render(:index) },
      pagination: -> { {
        count: requirement_requirements.size,
        **pagination_data(paginated_requirement_requirements)
      } },
    }
  end

  def show
    authorize requirement_requirement
    render inertia: "Requirement/Requirements/Show", props: {
      requirement_requirement: -> { requirement_requirement.render(:show) }
    }
  end

  def new
    authorize Requirement::Requirement.new
    render inertia: "Requirement/Requirements/New", props: {
      requirement_requirement: Requirement::Requirement.new.render(:form_data)
    }
  end

  def edit
    authorize requirement_requirement
    render inertia: "Requirement/Requirements/Edit", props: {
      requirement_requirement: requirement_requirement.render(:edit)
    }
  end

  def create
    authorize Requirement::Requirement.new
    if requirement_requirement.save
      redirect_to requirement_requirement, notice: "Requirement was successfully created."
    else
      redirect_to new_requirement_requirement_path, inertia: { errors: requirement_requirement.errors }
    end
  end

  def update
    authorize requirement_requirement
    if requirement_requirement.update(requirement_requirement_params)
      redirect_to requirement_requirement, notice: "Requirement was successfully updated."
    else
      redirect_to edit_requirement_requirement_path, inertia: { errors: requirement_requirement.errors }
    end
  end

  def destroy
    authorize requirement_requirement
    requirement_requirement.destroy!
    redirect_to requirement_requirements_url, notice: "Requirement was successfully destroyed."
  end
end
