class IncidentTypesController < ApplicationController
  include Searchable

  expose :incident_types, -> { search(@active_company.incident_types.includes_associated, sortable_fields) }
    expose :incident_type, scope: ->{ @active_company.incident_types }, find: ->(id, scope){ scope.includes_associated.find(id) }
  
  def index
    authorize incident_types
    render inertia: "IncidentType/Index", props: {
      incident_types: -> { incident_types.render(view: :index) }
    }
  end

  def show
    authorize incident_type
    render inertia: "IncidentType/Show", props: {
      incident_type: -> { incident_type.render(view: :show) }
    }
  end

  def new
    authorize IncidentType.new
    render inertia: "IncidentType/New", props: {
      incident_type: IncidentType.new.render(view: :form_data)
    }
  end

  def edit
    authorize incident_type
    render inertia: "IncidentType/Edit", props: {
      incident_type: incident_type.render(view: :edit)
    }
  end

  def create
    authorize IncidentType.new
    if incident_type.save
      redirect_to incident_type, notice: "Incident type was successfully created."
    else
      redirect_to new_incident_type_path, inertia: { errors: incident_type.errors }
    end
  end

  def update
    authorize incident_type
    if incident_type.update(incident_type_params)
      redirect_to incident_type, notice: "Incident type was successfully updated."
    else
      redirect_to edit_incident_type_path, inertia: { errors: incident_type.errors }
    end
  end

  def destroy
    authorize incident_type
    incident_type.destroy!
    redirect_to incident_types_url, notice: "Incident type was successfully destroyed."
  end

  private

  def sortable_fields
    %w(category_id name).freeze
  end

  def incident_type_params
    params.require(:incident_type).permit(:category_id, :name)
  end
end
