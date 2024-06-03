class PrescriptionsController < ApplicationController
  include Searchable

  expose :prescriptions, -> { search(Prescription.includes_associated, sortable_fields) }
  expose :prescription, scope: ->{ Prescription }, find: ->(id, scope){ scope.includes_associated.find(id) }

  def index
    authorize prescriptions
    render inertia: "Prescription/Index", props: {
      prescriptions: -> { prescriptions.render(view: :index) }
    }
  end

  def show
    authorize prescription
    render inertia: "Prescription/Show", props: {
      prescription: -> { prescription.render(view: :show) }
    }
  end

  def new
    authorize Prescription.new
    render inertia: "Prescription/New", props: {
      prescription: Prescription.new.render(view: :form_data)
    }
  end

  def edit
    authorize prescription
    render inertia: "Prescription/Edit", props: {
      prescription: prescription.render(view: :edit)
    }
  end

  def create
    authorize Prescription.new
    if prescription.save
      redirect_to prescription, notice: "Prescription was successfully created."
    else
      redirect_to new_prescription_path, inertia: { errors: prescription.errors }
    end
  end

  def update
    authorize prescription
    if prescription.update(prescription_params)
      redirect_to prescription, notice: "Prescription was successfully updated."
    else
      redirect_to edit_prescription_path, inertia: { errors: prescription.errors }
    end
  end

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
