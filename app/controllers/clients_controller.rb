class ClientsController < ApplicationController
  before_action :set_client, only: %i[show edit update destroy]
  before_action :set_clients, only: %i[index]

  # GET /clients
  def index
    render inertia: "Clients/Index", props: {
      clients: @clients.as_json,
    }
  end

  # GET /clients/:id
  def show
    render inertia: "Clients/Show", props: {
      client: @client.as_json,
    }
  end

  # GET /clients/new
  def new
    render inertia: "Clients/New", props: {
      client: Client.new.as_json,
    }
  end

  # GET /clients/:id/edit
  def edit
    render inertia: "Clients/Edit", props: {
      client: @client.as_json,
    }
  end

  # POST /clients
  def create
    @client = Client.new(example_params)

    if @client.save
      redirect_to client_url(@client), notice: "Client was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /clients/:id
  def update
    if @client.update(client_params)
      redirect_to client_url(@client), notice: "Client was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /clients/:id
  def destroy
    @client.destroy
    redirect_to clients_url, notice: "Client was successfully destroyed."
  end

  private

  def set_client
    @client = Client.find(class_name, params[:id])
  end

  def set_clients
    @clients = Client.all
  end

  def client_params
    params.require(:client).permit(:f_name, :l_name, :m_name, :slug)
  end
end
