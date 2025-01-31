class TimesheetsController < ApplicationController
  include Searchable
  
  expose :timesheets, -> { search(Timesheet.new.includes_associated) }
  expose :timesheet, scope: ->{ Timesheet.new.includes_associated }
  
  sortable_fields %w()

  strong_params :timesheet, fetch: :timesheet

  def index
    authorize timesheets

    paginated_timesheets = paginate(timesheets, :timesheets)
    
    render inertia: "Timesheets/Index", props: {
      timesheets: -> { paginated_timesheets.render(:index) },
      pagination: -> { {
        count: timesheets.size,
        **pagination_data(paginated_timesheets)
      } },
    }
  end

  def show
    authorize timesheet
    render inertia: "Timesheets/Show", props: {
      timesheet: -> { timesheet.render(:show) }
    }
  end

  def new
    authorize Timesheet.new
    render inertia: "Timesheets/New", props: {
      timesheet: Timesheet.new.render(:form_data)
    }
  end

  def edit
    authorize timesheet
    render inertia: "Timesheets/Edit", props: {
      timesheet: timesheet.render(:edit)
    }
  end

  def create
    authorize Timesheet.new
    if timesheet.save
      redirect_to timesheet, notice: "Timesheet was successfully created."
    else
      redirect_to new_timesheet_path, inertia: { errors: timesheet.errors }
    end
  end

  def update
    authorize timesheet
    if timesheet.update(timesheet_params)
      redirect_to timesheet, notice: "Timesheet was successfully updated."
    else
      redirect_to edit_timesheet_path, inertia: { errors: timesheet.errors }
    end
  end

  def destroy
    authorize timesheet
    timesheet.destroy!
    redirect_to timesheets_url, notice: "Timesheet was successfully destroyed."
  end
end
