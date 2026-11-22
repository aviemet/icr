class Api::ClientsController < ApplicationController
  expose :clients, -> { policy_scope(Client.includes_associated) }
  expose :client, id: ->{ params[:slug] }, scope: ->{ policy_scope(Client.includes_associated) }, find_by: :slug

  # @route GET /api/options/clients (api_clients_options)
  def options
    render json: clients.render(:options)
  end

  # @route GET /api/clients/:slug/schedule {param: :slug} (api_client_schedule)
  def schedule
    authorize client, :schedule?

    range_start, range_end = DateRangeCalculator.new(params).call
    masters = client.schedule_events_between(range_start, range_end)

    render json: Calendar::RenderSchedule.call(
      events: masters,
      range_start: range_start,
      range_end: range_end,
      view: :client,
    )
  end
end
