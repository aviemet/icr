class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  before_action :show_headers

  inertia_share auth: -> { { user: current_user.as_json(except: [:password]) } }

  def show_headers
    ap({ CSRF: request.headers['X-CSRF-Token'], host: request.headers['Host'] })
  end
end
