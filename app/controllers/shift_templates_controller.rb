class ShiftTemplatesController < ApplicationController
  expose :shift_templates, -> { search(ShiftTemplate.includes_associated) }
  expose :shift_template, scope: ->{ ShiftTemplate.includes_associated }

  sortable_fields %w(name)

  strong_params :shift_template, permit: [:name, :client_id, :created_by_id]

  # @route GET /shift_templates (shift_templates)
  def index
    authorize shift_templates

    paginated_shift_templates = paginate(shift_templates, :shift_templates)

    render inertia: "ShiftTemplates/Index", props: {
      shift_templates: -> { paginated_shift_templates.render(:index) },
      pagination: -> { {
        count: shift_templates.size,
        **pagination_data(paginated_shift_templates)
      } },
    }
  end

  # @route GET /shift_templates/:id (shift_template)
  def show
    authorize shift_template
    render inertia: "ShiftTemplate/Show", props: {
      shift_template: -> { shift_template.render(:show) }
    }
  end

  # @route GET /shift_templates/new (new_shift_template)
  def new
    authorize ShiftTemplate.new
    render inertia: "ShiftTemplate/New", props: {
      shift_template: ShiftTemplate.new.render(:form_data)
    }
  end

  # @route GET /shift_templates/:id/edit (edit_shift_template)
  def edit
    authorize shift_template
    render inertia: "ShiftTemplate/Edit", props: {
      shift_template: shift_template.render(:edit)
    }
  end

  # @route POST /shift_templates (shift_templates)
  def create
    authorize ShiftTemplate.new
    if shift_template.save
      redirect_to shift_template, notice: "Shift template was successfully created."
    else
      redirect_to new_shift_template_path, inertia: { errors: shift_template.errors }
    end
  end

  # @route PATCH /shift_templates/:id (shift_template)
  # @route PUT /shift_templates/:id (shift_template)
  def update
    authorize shift_template
    if shift_template.update(shift_template_params)
      redirect_to shift_template, notice: "Shift template was successfully updated."
    else
      redirect_to edit_shift_template_path, inertia: { errors: shift_template.errors }
    end
  end

  # @route DELETE /shift_templates/:id (shift_template)
  def destroy
    authorize shift_template
    shift_template.destroy!
    redirect_to shift_templates_url, notice: "Shift template was successfully destroyed."
  end
end
