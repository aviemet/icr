# frozen_string_literal: true

module Dev
  class ActsAsController < ApplicationController
    before_action :ensure_acts_as_available

    # @route POST /dev/acts_as (dev_acts_as)
    def create
      user = User.find(params.require(:user_id))
      start_acts_as!(user)
      redirect_to root_path
    end

    # @route DELETE /dev/acts_as (dev_acts_as)
    def destroy
      stop_acts_as!
      redirect_to root_path
    end

    private

    def ensure_acts_as_available
      head :not_found unless DevActsAs.enabled?
    end
  end
end
