class Clients::DiagnosesController < Clients::BaseController
  expose :diagnosis, model: Client::Diagnosis, scope: -> { client.diagnoses }

  strong_params :diagnosis, permit: [:name, :code, :diagnosed_on, :notes, :active]

  # @route POST /clients/:client_slug/diagnoses (client_diagnoses)
  def create
    authorize_client_update!
    diagnosis.assign_attributes(diagnosis_params)

    diagnosis.save
    redirect_to_client_tab("health")
  end

  # @route PATCH /clients/:client_slug/diagnoses/:id (client_diagnosis)
  # @route PUT /clients/:client_slug/diagnoses/:id (client_diagnosis)
  def update
    authorize_client_update!

    diagnosis.update(diagnosis_params)
    redirect_to_client_tab("health")
  end

  # @route DELETE /clients/:client_slug/diagnoses/:id (client_diagnosis)
  def destroy
    authorize_client_update!
    diagnosis.destroy!
    redirect_to_client_tab("health")
  end
end
