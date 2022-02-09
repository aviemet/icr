class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  around_action :apply_user_time_zone, if: :current_user

  inertia_share auth: -> { {
    user: current_user.as_json({
      except: [:password],
      include: :person,
    }),
    form_authenticity_token: form_authenticity_token,
  } }

  private

  def apply_user_time_zone(&block)
    Time.use_zone(current_user.time_zone, &block)
  end
end
