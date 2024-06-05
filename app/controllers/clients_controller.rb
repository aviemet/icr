class ClientsController < ApplicationController
  include Searchable

  expose :clients, -> { search(Client.includes_associated, sortable_fields) }
  expose :client, scope: ->{ Client }, find: ->(id, scope){ scope.includes_associated.find(id) }

  # @route GET /clients (clients)
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

  # @route GET /clients/:id (client)
  def show
    authorize client
    render inertia: "Clients/Show", props: {
      client: -> { client.render(view: :show) }
    }
  end

  # @route GET /clients/new (new_client)
  def new
    authorize Client.new
    render inertia: "Clients/New", props: {
      client: Client.new.render(view: :form_data)
    }
  end

  # @route GET /clients/:id/edit (edit_client)
  def edit
    authorize client
    render inertia: "Clients/Edit", props: {
      client: client.render(view: :edit)
    }
  end

  # @route GET /clients/:id/schedule (schedule_client)
  def schedule
    schedules = client.schedules.between(range_start, range_end)

    render inertia: "Clients/Schedule", props: {
      client: client.render,
      schedules: lambda {
        schedules.render(view: :show)
      },
    }
  end

  # @route POST /clients (clients)
  def create
    authorize Client.new
    if client.save
      redirect_to client, notice: "Client was successfully created."
    else
      redirect_to new_client_path, inertia: { errors: client.errors }
    end
  end

  # @route PATCH /clients/:id (client)
  # @route PUT /clients/:id (client)
  def update
    authorize client
    if client.update(client_params)
      redirect_to client, notice: "Client was successfully updated."
    else
      redirect_to edit_client_path, inertia: { errors: client.errors }
    end
  end

  # @route DELETE /clients/:id (client)
  def destroy
    authorize client
    client.destroy!
    redirect_to clients_url, notice: "Client was successfully destroyed."
  end

  private

  def range_start
    params[:start] || Time.zone.now.beginning_of_month.prev_occurring(:sunday)
  end

  def range_end
    params[:end] || Time.zone.now.end_of_month.next_occurring(:saturday)
  end

  def sortable_fields
    %w(active_at inactive_at number people.first_name people.last_name).freeze
  end

  def client_params
    params.require(:client).permit(:person_id, :active_at, :inactive_at, :number)
  end
end
