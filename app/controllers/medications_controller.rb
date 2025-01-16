class MedicationsController < ApplicationController
  include Searchable

  expose :medications, -> { Medication.includes_associated }
  expose :medication, scope: ->{ Medication }, find: ->(id, scope){ scope.includes_associated.find(id) }

  sortable_fields %w(name generic_name notes)

  strong_params :medication, permit: [:name, :generic_name, :notes]

  # @route GET /medications (medications)
  def index
    authorize medications
    render inertia: "Medication/Index", props: {
      medications: -> { medications.render(:index) }
    }
  end

  # @route GET /medications/:id (medication)
  def show
    authorize medication
    render inertia: "Medication/Show", props: {
      medication: -> { medication.render(:show) }
    }
  end

  # @route GET /medications/new (new_medication)
  def new
    authorize Medication.new
    render inertia: "Medication/New", props: {
      medication: Medication.new.render(:form_data)
    }
  end

  # @route GET /medications/:id/edit (edit_medication)
  def edit
    authorize medication
    render inertia: "Medication/Edit", props: {
      medication: medication.render(:edit)
    }
  end

  # @route POST /medications (medications)
  def create
    authorize Medication.new
    if medication.save
      redirect_to medication, notice: "Medication was successfully created."
    else
      redirect_to new_medication_path, inertia: { errors: medication.errors }
    end
  end

  # @route PATCH /medications/:id (medication)
  # @route PUT /medications/:id (medication)
  def update
    authorize medication
    if medication.update(medication_params)
      redirect_to medication, notice: "Medication was successfully updated."
    else
      redirect_to edit_medication_path, inertia: { errors: medication.errors }
    end
  end

  # @route DELETE /medications/:id (medication)
  def destroy
    authorize medication
    medication.destroy!
    redirect_to medications_url, notice: "Medication was successfully destroyed."
  end
end
