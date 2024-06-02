class MedicationsController < ApplicationController
  include Searchable

  expose :medications, -> { search(@active_company.medications.includes_associated, sortable_fields) }
    expose :medication, scope: ->{ @active_company.medications }, find: ->(id, scope){ scope.includes_associated.find(id) }
  
  def index
    authorize medications
    render inertia: "Medication/Index", props: {
      medications: -> { medications.render(view: :index) }
    }
  end

  def show
    authorize medication
    render inertia: "Medication/Show", props: {
      medication: -> { medication.render(view: :show) }
    }
  end

  def new
    authorize Medication.new
    render inertia: "Medication/New", props: {
      medication: Medication.new.render(view: :form_data)
    }
  end

  def edit
    authorize medication
    render inertia: "Medication/Edit", props: {
      medication: medication.render(view: :edit)
    }
  end

  def create
    authorize Medication.new
    if medication.save
      redirect_to medication, notice: "Medication was successfully created."
    else
      redirect_to new_medication_path, inertia: { errors: medication.errors }
    end
  end

  def update
    authorize medication
    if medication.update(medication_params)
      redirect_to medication, notice: "Medication was successfully updated."
    else
      redirect_to edit_medication_path, inertia: { errors: medication.errors }
    end
  end

  def destroy
    authorize medication
    medication.destroy!
    redirect_to medications_url, notice: "Medication was successfully destroyed."
  end

  private

  def sortable_fields
    %w(name generic_name notes).freeze
  end

  def medication_params
    params.require(:medication).permit(:name, :generic_name, :notes)
  end
end
