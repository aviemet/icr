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
    schedules = Client
      .includes([:person])
      .find_by(slug: params[:slug])
      .calendar_events
      .includes([:recurring_patterns, shift: [employee: [:person, :job_title, :calendar_customization]]])
      .between(range_start, range_end)

    render inertia: "Clients/Schedule", props: {
      client: -> { client.render(:show) },
      schedules: lambda {
        schedules.render(:show)
      },
    }
  end

  # @route POST /clients (clients)
  def create
    authorize Client.new

    if client.save
      redirect_to client_path(client), notice: t("clients.notices.created")
    else
      redirect_to new_client_path, inertia: { errors: client.errors }
    end
  end

  # @route PATCH /clients/:slug (client)
  # @route PUT /clients/:slug (client)
  def update
    authorize client

    if client.update(client_params)
      redirect_to client, notice: t("clients.notices.updated")
    else
      redirect_to edit_client_path(client), inertia: { errors: client.errors }
    end
  end

  # @route DELETE /clients/:slug (client)
  def destroy
    authorize client

    client.destroy!
    redirect_to clients_url, notice: t("clients.notices.destroyed")
  end

  private

  def range_start
    params[:start] || Time.current.beginning_of_month.prev_occurring(:sunday)
  end

  def range_end
    params[:end] || Time.current.end_of_month.next_occurring(:saturday)
  end
end
