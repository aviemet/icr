class ClientsController < ApplicationController
  before_action :set_client, only: %i[show edit schedule update destroy]
  before_action :set_clients, only: %i[index]

  # GET /clients
  def index
    render inertia: "Clients/Index", props: {
      clients: @clients.decorate.to_a,
    }
  end

  # GET /clients/:id
  def show
    render inertia: "Clients/Show", props: {
      client: @client.decorate.as_json,
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

  # GET /clients/:id/schedule
  def schedule
    # TODO: Employee query is for the form dropdown, employees should be scoped to clients
    @employees = Employee.all
    @shifts = @client.shifts_in_range(range_start, range_end)

    render inertia: "Clients/Schedule", props: {
      client: @client.decorate.as_json,
      employees: -> { @employees.decorate },
      shifts: lambda {
        @shifts.decorate.as_json({
          include: [:clients, :employee, :recurring_pattern, :shift_exceptions],
        })
      },
      dateRange: {
        start: range_start,
        end: range_end,
      },
    }
  end

  # POST /clients
  def create
    @client = Client.new(client_params)

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

  def range_start
    params[:start] || Time.current.beginning_of_month.prev_occurring(:sunday)
  end

  def range_end
    params[:end] || Time.current.end_of_month.next_occurring(:saturday)
  end

  def set_client
    @client = Client.find_by_slug(params[:id])
  end

  def set_clients
    @clients = Client.all
  end

  def client_params
    params.require(:client).permit(:first_name, :last_name, :middle_name, :slug)
  end
end
