class Clients::BaseController < ApplicationController
  expose :client, id: -> { params[:client_slug] || params[:slug] },
    scope: -> { policy_scope(Client) },
    find_by: :slug

  before_action :authorize_client!

  private

  def authorize_client!
    authorize client, :show?
  end

  def authorize_client_update!
    authorize client, :update?
  end

  def redirect_to_client_tab(tab)
    redirect_to client_path(client, tab: tab)
  end
end
