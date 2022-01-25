class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  prepend_before_action :show_headers

  inertia_share auth: -> { { 
    user: current_user.as_json(except: [:password]),
    form_authenticity_token: form_authenticity_token,
  } }

  def show_headers
    ap({ request_forgery_protection_token: request_forgery_protection_token, form_authenticity_token: form_authenticity_token})
    ap({ CSRF: request.headers['X-CSRF-Token'], host: request.headers['Host'] })
  end
end
