class ClientsController < ApplicationController
  include Searchable

  expose :clients, -> { search(Client.includes_associated, sortable_fields) }
  expose :client, scope: ->{ Client }, find: ->(id, scope){ scope.includes_associated.find(id) }

  def index
    authorize clients
    paginated_clients = clients.page(params[:page] || 1).per(current_user.limit(:clients))

    render inertia: "Clients/Index", props: {
      clients: -> { paginated_clients.render(view: :index) },
      pagination: -> { {
        count: clients.count,
        **pagination_data(paginated_clients)
      } }
    }
  end

  def show
    authorize client
    render inertia: "Clients/Show", props: {
      client: -> { client.render(view: :show) }
    }
  end

  def new
    authorize Client.new
    render inertia: "Clients/New", props: {
      client: Client.new.render(view: :form_data)
    }
  end

  def edit
    authorize client
    render inertia: "Clients/Edit", props: {
      client: client.render(view: :edit)
    }
  end

  def create
    authorize Client.new
    if client.save
      redirect_to client, notice: "Client was successfully created."
    else
      redirect_to new_client_path, inertia: { errors: client.errors }
    end
  end

  def update
    authorize client
    if client.update(client_params)
      redirect_to client, notice: "Client was successfully updated."
    else
      redirect_to edit_client_path, inertia: { errors: client.errors }
    end
  end

  def destroy
    authorize client
    client.destroy!
    redirect_to clients_url, notice: "Client was successfully destroyed."
  end

  private

  def sortable_fields
    %w(active_at inactive_at number people.first_name people.last_name).freeze
  end

  def client_params
    params.require(:client).permit(:person_id, :active_at, :inactive_at, :number)
  end
end
