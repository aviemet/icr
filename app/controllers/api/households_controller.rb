class Api::HouseholdsController < ApplicationController
  expose :household, id: -> { params[:slug] }, scope: -> { policy_scope(Household) }, find_by: :slug

  # @route GET /api/households/:slug/schedule {param: :slug} (api_household_schedule)
  def schedule
    authorize household, :schedule?

    range_start, range_end = DateRangeCalculator.new(params).call

    render json: Households::RenderSchedule.call(
      household: household,
      range_start: range_start,
      range_end: range_end,
    )
  end
end
