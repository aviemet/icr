class ClientsController < ApplicationController
  include Searchable

  expose :clients, -> { policy_scope(search(Client.includes_associated)) }
  expose :client, id: -> { params[:slug] }, scope: -> { policy_scope(Client.includes_associated) }, find_by: :slug

  sortable_fields %w(active_at inactive_at number people.first_name people.last_name)

  filterable_fields :number, :active_at,
    first_name: { column: "people.first_name" },
    last_name: { column: "people.last_name" },
    uci_number: { column: :uci_number }

  strong_params :client, permit: [
    :person_id, :active_at, :inactive_at, :number, :color,
    :uci_number, :regional_center, :medi_cal_number,
    :ipp_starts_on, :ipp_ends_on, :ipp_review_on,
    :preferred_hospital, :preferred_language, :communication_notes,
    :ihss_authorized_hours, :ihss_share_of_cost, :ihss_notes,
    person_attributes: [
      :id, :first_name, :last_name, :middle_name, :nick_name, :dob, :characteristics,
      contact_attributes: [
        :id,
        addresses_attributes: [
          :id, :name, :address, :address_2, :city, :region, :postal, :country, :notes, :category_id, :_destroy,
        ],
        phones_attributes: [
          :id, :name, :number, :extension, :notes, :category_id, :_destroy,
        ],
        emails_attributes: [
          :id, :name, :email, :notes, :category_id, :_destroy,
        ],
      ],
    ],
    life_detail_attributes: [
      :id, :adls, :adaptive_supports, :behavior_supports, :routines, :risk_flags,
    ],
  ]

  # @route GET /clients (clients)
  def index
    authorize Client

    paginated_clients = paginate(clients, :clients)
    page_clients = paginated_clients.to_a

    render inertia: "Clients/Index", props: {
      clients: -> { page_clients.map { |record| record.render(:index) } },
      can_updates: -> {
        page_clients.to_h { |record| [record.id, policy(record).update?] }
      },
      pagination: -> { {
        count: clients.count,
        **pagination_data(paginated_clients)
      } }
    }
  end

  # @route GET /clients/:slug (client)
  def show
    authorize client

    client_for_show = Client.includes_show.find(client.id)

    render inertia: "Clients/Show", props: {
      client: -> { client_for_show.render(:show) },
      can_update: -> { policy(client).update? },
      can_view_open_shifts: -> { Shifts::OpenVisibility.can_view?(current_user, client) },
      open_shifts_count: -> { Shifts::OpenVisibility.future_open_count_for_client(current_user, client) },
      training_options: -> {
        linked_ids = client_for_show.clients_trainings.map(&:training_id)
        Employee::Training.active.where.not(id: linked_ids).order(:name).render(:options)
      },
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
    authorize client

    client_for_show = Client.includes_show.find(client.id)

    range_start, range_end = DateRangeCalculator.new(params).call
    masters = client.schedule_events_between(range_start, range_end)

    render inertia: "Clients/Schedule", props: {
      client: -> { client_for_show.render(:show) },
      can_update: -> { policy(client).update? },
      schedules: lambda {
        Calendar::RenderSchedule.call(
          events: masters,
          range_start: range_start,
          range_end: range_end,
          view: :client,
        )
      },
    }
  end

  # @route POST /clients (clients)
  def create
    authorize Client.new

    client.assign_attributes(client_params)

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
      redirect_to client_path(client, tab: params[:tab].presence || "profile"),
        notice: t("templates.controllers.notices.updated", model: "Client")
    else
      redirect_back_or_to edit_client_path(client), inertia: { errors: client.errors }
    end
  end

  # @route DELETE /clients/:slug (client)
  def destroy
    authorize client

    client.destroy!
    redirect_to clients_url, notice: t("templates.controllers.notices.destroyed", model: "Client")
  end
end
