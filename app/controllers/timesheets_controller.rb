class TimesheetsController < ApplicationController
  include Searchable

  expose :timesheets, -> { search(Timesheet.includes_associated) }
  expose :timesheet, scope: ->{ Timesheet.includes_associated }

  sortable_fields %w(employee.name pay_period_start pay_period_end approved_at)

  strong_params :timesheet, fetch: :timesheet

  # @route GET /timesheets (timesheets)
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

  # @route GET /timesheets/:id (timesheet)
  def show
    authorize timesheet
    render inertia: "Timesheets/Show", props: {
      timesheet: -> { timesheet.render(:show) }
    }
  end

  # @route GET /timesheets/new (new_timesheet)
  def new
    authorize Timesheet.new
    render inertia: "Timesheets/New", props: {
      timesheet: Timesheet.new.render(:form_data)
    }
  end

  # @route GET /timesheets/:id/edit (edit_timesheet)
  def edit
    authorize timesheet
    render inertia: "Timesheets/Edit", props: {
      timesheet: timesheet.render(:edit)
    }
  end

  # @route POST /timesheets (timesheets)
  def create
    authorize Timesheet.new
    if timesheet.save
      redirect_to timesheet, notice: t("templates.controllers.notices.created", model: "Timesheet")
    else
      redirect_to new_timesheet_path, inertia: { errors: timesheet.errors }
    end
  end

  # @route PATCH /timesheets/:id (timesheet)
  # @route PUT /timesheets/:id (timesheet)
  def update
    authorize timesheet
    if timesheet.update(timesheet_params)
      redirect_to timesheet, notice: t("templates.controllers.notices.updated", model: "Timesheet")
    else
      redirect_to edit_timesheet_path, inertia: { errors: timesheet.errors }
    end
  end

  # @route DELETE /timesheets/:id (timesheet)
  def destroy
    authorize timesheet
    timesheet.destroy!
    redirect_to timesheets_url, notice: t("templates.controllers.notices.destroyed", model: "Timesheet")
  end
end
