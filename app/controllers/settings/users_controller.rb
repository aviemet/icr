class Settings::UsersController < ApplicationController
  # @route GET /settings/user (settings_user)
  def show
    authorize current_user, :show?

    render inertia: "Settings/User"
  end
end
