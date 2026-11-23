class Clients::LinksController < Clients::BaseController
  expose :link, model: Client::Link, scope: -> { client.links }

  strong_params :link, permit: [:title, :url]

  def create
    authorize_client_update!
    link.assign_attributes(link_params)

    if link.save
      redirect_to_client_tab("overview")
    else
      redirect_to client_path(client, tab: "overview"), inertia: { errors: link.errors }
    end
  end

  def update
    authorize_client_update!

    if link.update(link_params)
      redirect_to_client_tab("overview")
    else
      redirect_to client_path(client, tab: "overview"), inertia: { errors: link.errors }
    end
  end

  def destroy
    authorize_client_update!
    link.destroy!
    redirect_to_client_tab("overview")
  end
end
