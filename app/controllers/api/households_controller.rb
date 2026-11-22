class Api::HouseholdsController < ApplicationController
  expose :household, id: -> { params[:slug] }, scope: -> { policy_scope(Household) }, find_by: :slug

  # @route GET /api/households/:slug/schedule {param: :slug} (api_household_schedule)
  def schedule
    authorize household, :schedule?

    range_start, range_end = DateRangeCalculator.new(params).call
    masters = household.schedule_events_between(range_start, range_end)

    render json: Calendar::RenderSchedule.call(
      events: masters,
      range_start: range_start,
      range_end: range_end,
      view: :household,
    )
  end
end
