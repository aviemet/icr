class ClientsController < InertiaController
  expose :client, find_by: :slug
  expose :clients, -> { Client.all }
  expose :employees, -> { Employee.all }

  # @route GET /clients (clients)
  def index
    render inertia: "Clients/Index", props: {
      clients: clients.render(view: :index),
    }
  end

  # @route GET /clients/:id (client)
  def show
    render inertia: "Clients/Show", props: {
      client: client.render(view: :show),
    }
  end

  # @route GET /clients/new (new_client)
  def new
    render inertia: "Clients/New", props: {
      client: Client.new.render(view: :form_data),
    }
  end

  # @route GET /clients/:id/edit (edit_client)
  def edit
    render inertia: "Clients/Edit", props: {
      client: client.render(view: :edit),
    }
  end

  # @route GET /clients/:id/schedule (schedule_client)
  def schedule
    shifts = client.shifts.includes(:clients, :employee, :recurring_pattern).between(range_start, range_end)

    render inertia: "Clients/Schedule", props: {
      client: client.render,
      employees: -> { employees.render },
      shifts: lambda {
        shifts.render
      },
    }
  end

  # @route POST /clients (clients)
  def create
    client = Client.new(client_params)

    if client.save
      redirect_to client_url(client), notice: "Client was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # @route PATCH /clients/:id (client)
  # @route PUT /clients/:id (client)
  def update
    if client.update(client_params)
      redirect_to client_url(client), notice: "Client was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # @route DELETE /clients/:id (client)
  def destroy
    client.destroy
    redirect_to clients_url, notice: "Client was successfully destroyed."
  end

  private

  def range_start
    params[:start] || Time.zone.now.beginning_of_month.prev_occurring(:sunday)
  end

  def range_end
    params[:end] || Time.zone.now.end_of_month.next_occurring(:saturday)
  end

  def client_params
    params.require(:client).permit(:first_name, :last_name, :middle_name, :slug)
  end
end
