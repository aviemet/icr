class TimesheetHoursController < ApplicationController
  include Searchable
  
  expose :timesheet_hours, -> { search(TimesheetHour.new.includes_associated) }
  expose :timesheet_hour, scope: ->{ TimesheetHour.new.includes_associated }
  
  sortable_fields %w()

  strong_params :timesheet_hour, fetch: :timesheet_hour

  def index
    authorize timesheet_hours

    paginated_timesheet_hours = paginate(timesheet_hours, :timesheet_hours)
    
    render inertia: "TimesheetHours/Index", props: {
      timesheet_hours: -> { paginated_timesheet_hours.render(:index) },
      pagination: -> { {
        count: timesheet_hours.size,
        **pagination_data(paginated_timesheet_hours)
      } },
    }
  end

  def show
    authorize timesheet_hour
    render inertia: "TimesheetHours/Show", props: {
      timesheet_hour: -> { timesheet_hour.render(:show) }
    }
  end

  def new
    authorize TimesheetHour.new
    render inertia: "TimesheetHours/New", props: {
      timesheet_hour: TimesheetHour.new.render(:form_data)
    }
  end

  def edit
    authorize timesheet_hour
    render inertia: "TimesheetHours/Edit", props: {
      timesheet_hour: timesheet_hour.render(:edit)
    }
  end

  def create
    authorize TimesheetHour.new
    if timesheet_hour.save
      redirect_to timesheet_hour, notice: "Timesheet hour was successfully created."
    else
      redirect_to new_timesheet_hour_path, inertia: { errors: timesheet_hour.errors }
    end
  end

  def update
    authorize timesheet_hour
    if timesheet_hour.update(timesheet_hour_params)
      redirect_to timesheet_hour, notice: "Timesheet hour was successfully updated."
    else
      redirect_to edit_timesheet_hour_path, inertia: { errors: timesheet_hour.errors }
    end
  end

  def destroy
    authorize timesheet_hour
    timesheet_hour.destroy!
    redirect_to timesheet_hours_url, notice: "Timesheet hour was successfully destroyed."
  end
end
