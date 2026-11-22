class Clients::AllergiesController < Clients::BaseController
  expose :allergy, model: Client::Allergy, scope: -> { client.allergies }

  strong_params :allergy, permit: [:name, :severity, :reaction, :notes, :active]

  # @route POST /clients/:client_slug/allergies (client_allergies)
  def create
    authorize_client_update!
    allergy.assign_attributes(allergy_params)

    allergy.save
    redirect_to_client_tab("medical")
  end

  # @route PATCH /clients/:client_slug/allergies/:id (client_allergy)
  # @route PUT /clients/:client_slug/allergies/:id (client_allergy)
  def update
    authorize_client_update!

    allergy.update(allergy_params)
    redirect_to_client_tab("medical")
  end

  # @route DELETE /clients/:client_slug/allergies/:id (client_allergy)
  def destroy
    authorize_client_update!
    allergy.destroy!
    redirect_to_client_tab("medical")
  end
end
