class Api::CalendarEventsController < Api::ApiController
  expose :calendar_events, -> { Calendar::Event.all }
  expose :calendar_event, model: Calendar::Event

  strong_params :calendar_event, permit: [:name, :starts_at, :ends_at, :parent_id]

  # @route POST /api/calendar_events (api_calendar_events)
  def create
    authorize Calendar::Event.new

    calendar_event.created_by = current_user

    pry calendar_event

    if calendar_event.save
      render json: calendar_event.render, status: :created
    else
      render json: { errors: calendar_event.errors}, status: :see_other
    end
  end

  # @route PATCH /api/calendar_events/:id (api_calendar_event)
  # @route PUT /api/calendar_events/:id (api_calendar_event)
  def update
    authorize calendar_event

    if calendar_event.update(calendar_event_params)
      render json: calendar_event.render, status: :created
    else
      render json: { errors: calendar_event.errors }, status: :see_other
    end
  end

  # @route DELETE /api/calendar_events/:id (api_calendar_event)
  def destroy
    authorize calendar_event

    if calendar_event.destroy!
      head :no_content
    else
      render json: { errors: }
    end
  end
end
