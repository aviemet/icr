class ApplicationController < ActionController::Base
  before_action :authenticate_user!
	around_action :set_time_zone, if: :current_user
  # append_before_action :log_person

  inertia_share auth: -> { {
    user: current_user.as_json({
      except: [:password],
      include: :person
    }),
    form_authenticity_token: form_authenticity_token,
  } }

  def log_person
    ap({ user: current_user.as_json(except: [:password]) })
  end

	private

	def set_time_zone(&block)
		Time.use_zone(current_user.time_zone, &block)
	end
end
