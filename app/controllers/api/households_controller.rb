class Api::HouseholdsController < ApplicationController
  # @route GET /api/households/:slug/schedule {param: :slug} (api_household_schedule)
  def schedule
    schedules = Household
      .find_by!(slug: params[:slug])
      .schedule_events_between(*DateRangeCalculator.new(params).call)

    render json: schedules.render(:household)
  end
end
