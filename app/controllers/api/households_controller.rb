class Api::HouseholdsController < ApplicationController
  expose :household, id: -> { params[:slug] }, scope: -> { policy_scope(Household) }, find_by: :slug

  # @route GET /api/households/:slug/schedule {param: :slug} (api_household_schedule)
  def schedule
    authorize household, :schedule?

    schedules = household.schedule_events_between(*DateRangeCalculator.new(params).call)

    render json: schedules.render(:household)
  end
end
