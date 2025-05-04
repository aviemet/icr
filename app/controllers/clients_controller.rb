class ClientsController < ApplicationController
  include Searchable

  expose :clients, ->{ policy_scope(search(Client.includes_associated)) }
  expose :client, id: ->{ params[:slug] }, scope: ->{ policy_scope(Client.includes_associated) }, find_by: :slug

  sortable_fields %w(active_at inactive_at number people.first_name people.last_name)

  strong_params :client, permit: [
    :person_id, :active_at, :inactive_at, :number, person_attributes: [
      :first_name, :last_name, :middle_name, :nick_name, :dob, :characteristics
    ]
  ]

  # @route GET /clients (clients)
  def index
    authorize clients

    paginated_clients = paginate(clients, :clients)

    render inertia: "Clients/Index", props: {
      clients: -> { paginated_clients.render(:index) },
      pagination: -> { {
        count: clients.count,
        **pagination_data(paginated_clients)
      } }
    }
  end

  # @route GET /clients/:slug (client)
  def show
    authorize client

    render inertia: "Clients/Show", props: {
      client: -> { client.render(:show) }
    }
  end

  # @route GET /clients/new (new_client)
  def new
    authorize Client.new

    render inertia: "Clients/New", props: {
      client: Client.new.render(:form_data)
    }
  end

  # @route GET /clients/:slug/edit (edit_client)
  def edit
    authorize client

    render inertia: "Clients/Edit", props: {
      client: client.render(:edit)
    }
  end

  # @route GET /clients/:slug/schedule (schedule_client)
  def schedule
    schedules = client
      .calendar_events
      .includes([:recurring_patterns, :event_participants, shift: [employee: [:person, :job_title, :calendar_customization]]])
      .between(*DateRangeCalculator.new(params).call)

    render inertia: "Clients/Schedule", props: {
      client: -> { client.render(:show) },
      schedules: lambda {
        schedules.render(:client)
      },
    }
  end

  # @route POST /clients (clients)
  def create
    authorize Client.new

    if client.save
      redirect_to client_path(client), notice: t("templates.controllers.notices.created", model: "Client")
    else
      redirect_to new_client_path, inertia: { errors: client.errors }
    end
  end

  # @route PATCH /clients/:slug (client)
  # @route PUT /clients/:slug (client)
  def update
    authorize client

    if client.update(client_params)
      redirect_to client, notice: t("templates.controllers.notices.updated", model: "Client")
    else
      redirect_to edit_client_path(client), inertia: { errors: client.errors }
    end
  end

  # @route DELETE /clients/:slug (client)
  def destroy
    authorize client

    client.destroy!
    redirect_to clients_url, notice: t("templates.controllers.notices.destroyed", model: "Client")
  end
end
