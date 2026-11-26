class Clients::PortraitsController < Clients::BaseController
  # @route POST /clients/:client_slug/portrait (client_portrait)
  def create
    authorize_client_update!

    if params[:portrait].present?
      client.portrait.attach(params[:portrait])
    end

    redirect_to_client_tab("profile")
  end

  # @route DELETE /clients/:client_slug/portrait (client_portrait)
  def destroy
    authorize_client_update!
    client.portrait.purge if client.portrait.attached?
    redirect_to_client_tab("profile")
  end
end
