class Clients::DocumentsController < Clients::BaseController
  # @route POST /clients/:client_slug/documents (client_documents)
  def create
    authorize_client_update!

    if params[:document].present?
      client.documents.attach(params[:document])
    end

    redirect_to_client_tab("documents")
  end

  # @route DELETE /clients/:client_slug/documents/:id (client_document)
  def destroy
    authorize_client_update!
    document = client.documents.find(params.expect(:id))
    document.purge
    redirect_to_client_tab("documents")
  end
end
