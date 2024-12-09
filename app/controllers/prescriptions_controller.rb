class PrescriptionsController < ApplicationController
  include Searchable

  expose :prescriptions, -> { search(Prescription.includes_associated, sortable_fields) }
  expose :prescription, scope: ->{ Prescription }, find: ->(id, scope){ scope.includes_associated.find(id) }

  # @route GET /prescriptions (prescriptions)
  def index
    authorize prescriptions
    render inertia: "Prescription/Index", props: {
      prescriptions: -> { prescriptions.render(:index) }
    }
  end

  # @route GET /prescriptions/:id (prescription)
  def show
    authorize prescription
    render inertia: "Prescription/Show", props: {
      prescription: -> { prescription.render(:show) }
    }
  end

  # @route GET /prescriptions/new (new_prescription)
  def new
    authorize Prescription.new
    render inertia: "Prescription/New", props: {
      prescription: Prescription.new.render(:form_data)
    }
  end

  # @route GET /prescriptions/:id/edit (edit_prescription)
  def edit
    authorize prescription
    render inertia: "Prescription/Edit", props: {
      prescription: prescription.render(:edit)
    }
  end

  # @route POST /prescriptions (prescriptions)
  def create
    authorize Prescription.new
    if prescription.save
      redirect_to prescription, notice: "Prescription was successfully created."
    else
      redirect_to new_prescription_path, inertia: { errors: prescription.errors }
    end
  end

  # @route PATCH /prescriptions/:id (prescription)
  # @route PUT /prescriptions/:id (prescription)
  def update
    authorize prescription
    if prescription.update(prescription_params)
      redirect_to prescription, notice: "Prescription was successfully updated."
    else
      redirect_to edit_prescription_path, inertia: { errors: prescription.errors }
    end
  end

  # @route DELETE /prescriptions/:id (prescription)
  def destroy
    authorize prescription
    prescription.destroy!
    redirect_to prescriptions_url, notice: "Prescription was successfully destroyed."
  end

  private

  def sortable_fields
    %w(medication_id client_id start_at ends_at doctor_id dosage_id).freeze
  end

  def prescription_params
    params.require(:prescription).permit(:medication_id, :client_id, :start_at, :ends_at, :doctor_id, :dosage_id)
  end
end
