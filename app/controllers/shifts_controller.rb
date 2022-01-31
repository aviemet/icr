class ShiftsController < ApplicationController
  # GET /schedules
  # Routes.shifts()
  def index
    @clients = Client.all
    render inertia: "Schedules/Index", props: {
      clients: @clients.as_json,
    }
  end

  # POST /schedules
  # Routes.shifts()
  def create
    @shift = Shift.create(shift_params)

    if @shift.persisted?
      redirect_to schedule_client_path(@shift.clients[0])
    else
      redirect_to schedule_client_path(@shift.clients[0]), inertia: { errors: @shift.errors }
    end
  end

  # PATCH/PUT /schedules/:id
  # Routes.shifts(id)
  def update
    if @shift.update(shift_params)
      
    else
      
    end
  end

  private

  def set_shift
    @shift = Shift.find(params[:id])
  end

  def set_shifts
    @shifts = Shift.all
  end

  def shift_params
    params.require(:shift).permit(:starts_at, :ends_at, :employee_id, :created_by_id, client_ids: [])
  end
end
