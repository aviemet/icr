class Api::ClientsController < ApplicationController
  expose :clients, -> { policy_scope(Client.includes_associated) }
  expose :client, id: ->{ params[:slug] }, scope: ->{ policy_scope(Client.includes_associated) }, find_by: :slug

  # @route GET /api/options/clients (api_clients_options)
  def options
    render json: clients.render(:options)
  end

  # @route GET /api/clients/:slug/schedule {param: :slug} (api_client_schedule)
  def schedule
    schedules = Client
      .includes([:person])
      .find_by(slug: params[:slug])
      .calendar_events
      .includes([:recurring_patterns, shift: [employee: [:person, :job_title, :calendar_customization]]])
      .between(*DateRangeCalculator.new(params).call)

    render json: schedules.render
  end
end
