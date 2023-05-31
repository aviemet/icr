class ShiftsController < ApplicationController
  expose :shifts, ->{ Shift.all }
  expose :shift

  # GET /schedules
  def index
    clients = Client.all
    render inertia: "Schedules/Index", props: {
      clients: clients.render,
    }
  end

  # POST /schedules
  def create
    if shift.persisted?
      redirect_to schedule_client_path(shift.clients[0])
    else
      redirect_to schedule_client_path(shift.clients[0]), inertia: { errors: shift.errors }
    end
  end

  # PATCH/PUT /schedules/:id
  def update; end

  private

  def shift_params
    params.require(:shift).permit(
      :starts_at,
      :ends_at,
      :employee_id,
      :created_by_id,
      :is_recurring,
      client_ids: [],
      recurring_pattern_attributes: [
        :recurring_type,
        :separation_count,
        :offset,
        :end_date,
        :max_occurances,
        :day_of_week,
        :day_of_month,
        :month_of_year,
      ],
    )
  end
end
