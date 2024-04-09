class ShiftsController < InertiaController
  expose :shifts
  expose :shift

  # @route GET /schedule (shifts)
  def index
    @clients = Client.all
    render inertia: "Schedules/Index", props: {
      clients: @clients.render(view: :index),
    }
  end

  # Routes.shifts()
  # @route POST /schedule (shifts)
  def create
    ap({ shift_params:, params: })
    @shift = Shift.create(shift_params)

    if @shift.persisted?
      redirect_to schedule_client_path(@shift.clients[0])
    else
      redirect_to schedule_client_path(@shift.clients[0]), inertia: { errors: @shift.errors }
    end
  end

  # @route PATCH /schedule/:id (shift)
  # @route PUT /schedule/:id (shift)
  def update; end

  private

  def set_shift
    @shift = Shift.find(params[:id])
  end

  def set_shifts
    @shifts = Shift.all
  end

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
