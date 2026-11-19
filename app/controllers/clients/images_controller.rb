class Clients::ImagesController < Clients::BaseController
  # @route POST /clients/:client_slug/images (client_images)
  def create
    authorize_client_update!

    if params[:image].present?
      client.images.attach(params[:image])
    end

    redirect_to_client_tab("documents")
  end

  # @route DELETE /clients/:client_slug/images/:id (client_image)
  def destroy
    authorize_client_update!
    image = client.images.find(params.expect(:id))
    image.purge
    redirect_to_client_tab("documents")
  end
end
