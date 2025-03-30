class Api::ClientsController < ApplicationController
  expose :clients, -> { Client.includes_associated.all }

  # @route GET /api/options/clients (api_clients_options)
  def options
    render json: clients.render(:options)
  end
end
