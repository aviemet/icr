class ClientsController < ApplicationController
  include Searchable

  expose :clients, -> { search(@active_company.clients.includes_associated, sortable_fields) }
  expose :client, scope: ->{ @active_company.clients }, find: ->(id, scope){ scope.includes_associated.find(id) }

  def index
    authorize clients
    render inertia: "Client/Index", props: {
      clients: -> { clients.render(view: :index) }
    }
  end

  def show
    authorize client
    render inertia: "Client/Show", props: {
      client: -> { client.render(view: :show) }
    }
  end

  def new
    authorize Client.new
    render inertia: "Client/New", props: {
      client: Client.new.render(view: :form_data)
    }
  end

  def edit
    authorize client
    render inertia: "Client/Edit", props: {
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
    %w(person_id active_at inactive_at number).freeze
  end

  def client_params
    params.require(:client).permit(:person_id, :active_at, :inactive_at, :number)
  end
end
