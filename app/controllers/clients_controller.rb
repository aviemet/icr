class ClientsController < ApplicationController
  expose :clients, ->{ Client.includes_associated }
  expose :client

  # GET /clients
  def index
    render inertia: "Clients/Index", props: {
      clients: clients.render,
    }
  end

  # GET /clients/:id
  def show
    render inertia: "Clients/Show", props: {
      client: client.render,
    }
  end

  # GET /clients/new
  def new
    render inertia: "Clients/New", props: {
      client: Client.new.render,
    }
  end

  # GET /clients/:id/edit
  def edit
    render inertia: "Clients/Edit", props: {
      client: client.render,
    }
  end

  # GET /clients/:id/schedule
  def schedule
    # TODO: Employee query is for the form dropdown, employees should be scoped to clients
    render inertia: "Clients/Schedule", props: {
      client: client.render,
      shifts: client.shifts_in_range(range_start, range_end).render,
      dateRange: {
        start: range_start,
        end: range_end,
      },
    }
  end

  # POST /clients
  def create
    client = Client.new(client_params)

    if client.save
      redirect_to client_url(client), notice: "Client was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /clients/:id
  def update
    if client.update(client_params)
      redirect_to client_url(client), notice: "Client was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /clients/:id
  def destroy
    client.destroy
    redirect_to clients_url, notice: "Client was successfully destroyed."
  end

  private

  def range_start
    params[:start] || Time.current.beginning_of_month.prev_occurring(:sunday)
  end

  def range_end
    params[:end] || Time.current.end_of_month.next_occurring(:saturday)
  end

  def client_params
    params.require(:client).permit(:number)
  end
end
