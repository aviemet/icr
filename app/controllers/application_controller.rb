class ApplicationController < ActionController::Base
  before_action :authenticate_user!

  inertia_share auth: -> { {
    user: current_user.as_json(except: [:password]),
    form_authenticity_token: form_authenticity_token,
  } }
end
