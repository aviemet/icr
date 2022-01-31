class SchedulesController < ApplicationController
	# GET /schedules
	def index
		@clients = Client.all
		render inertia: "Schedules/Index", props: {
			clients: @clients
		}
	end

  # POST /schedules
  def create
    @shift = Shift.new(shift_params)
		ap({ params: params, shift: @shift })

    if @shift.save
			ap "SUCCESS"
    else
			ap "ERROR"
			ap({errors: @shift.errors})
    end
  end

  # PATCH/PUT /schedules/:id
  def update
    if @shift.update(shift_params)
      redirect_to shift_url(@shift), notice: "Client was successfully updated."
    else
      render :edit, status: :unprocessable_entity
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
    params.require(:shift).permit(:starts_at, :ends_at, :employee_id, :client_ids, :created_by_id)
  end
end
