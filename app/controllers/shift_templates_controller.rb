class ShiftTemplatesController < ApplicationController
  include Searchable
  
  expose :shift_templates, -> { search(@active_company.shift_templates.includes_associated, sortable_fields) }
  expose :shift_template, scope: ->{ @active_company.shift_templates }, find: ->(id, scope){ scope.includes_associated.find(id) }
  
  sortable_fields %w(name client_id created_by_id)

  strong_params shift_template, permit: [:name, :client_id, :created_by_id]

  def index
    authorize shift_templates

    paginated_shift_templates = shift_templates.page(params[:page] || 1).per(current_user.limit(:items))
    
    render inertia: "ShiftTemplates/Index", props: {
      shift_templates: -> { paginated_shift_templates.render(:index) },
      pagination: -> { {
        count: shift_templates.size,
        **pagination_data(paginated_shift_templates)
      } },
    }
  end

  def show
    authorize shift_template
    render inertia: "ShiftTemplate/Show", props: {
      shift_template: -> { shift_template.render(:show) }
    }
  end

  def new
    authorize ShiftTemplate.new
    render inertia: "ShiftTemplate/New", props: {
      shift_template: ShiftTemplate.new.render(:form_data)
    }
  end

  def edit
    authorize shift_template
    render inertia: "ShiftTemplate/Edit", props: {
      shift_template: shift_template.render(:edit)
    }
  end

  def create
    authorize ShiftTemplate.new
    if shift_template.save
      redirect_to shift_template, notice: "Shift template was successfully created."
    else
      redirect_to new_shift_template_path, inertia: { errors: shift_template.errors }
    end
  end

  def update
    authorize shift_template
    if shift_template.update(shift_template_params)
      redirect_to shift_template, notice: "Shift template was successfully updated."
    else
      redirect_to edit_shift_template_path, inertia: { errors: shift_template.errors }
    end
  end

  def destroy
    authorize shift_template
    shift_template.destroy!
    redirect_to shift_templates_url, notice: "Shift template was successfully destroyed."
  end
end
