class Clients::PrescriptionsController < Clients::BaseController
  expose :prescription, scope: -> { client.prescriptions }

  strong_params :prescription, permit: [
    :medication_id, :doctor_id, :starts_at, :ends_at,
    dosage_attributes: [:id, :amount, :amount_unit, :freq_amount, :freq_period, :administration_method, :notes],
    medication_attributes: [:id, :name, :generic_name, :notes],
  ]

  # @route POST /clients/:client_slug/prescriptions (client_prescriptions)
  def create
    authorize_client_update!
    prescription.assign_attributes(prescription_create_params)

    prescription.save
    redirect_to_client_tab("medical")
  end

  # @route PATCH /clients/:client_slug/prescriptions/:id (client_prescription)
  # @route PUT /clients/:client_slug/prescriptions/:id (client_prescription)
  def update
    authorize_client_update!

    prescription.update(prescription_params)
    redirect_to_client_tab("medical")
  end

  # @route DELETE /clients/:client_slug/prescriptions/:id (client_prescription)
  def destroy
    authorize_client_update!
    prescription.destroy!
    redirect_to_client_tab("medical")
  end

  private

  def prescription_create_params
    attrs = prescription_params.to_h
    if attrs[:medication_id].blank? && attrs[:medication_attributes].present?
      medication = Medication.find_or_create_by!(name: attrs[:medication_attributes][:name]) do |record|
        record.generic_name = attrs[:medication_attributes][:generic_name]
        record.notes = attrs[:medication_attributes][:notes]
      end
      attrs[:medication_id] = medication.id
    end
    attrs.delete(:medication_attributes)
    attrs
  end
end
