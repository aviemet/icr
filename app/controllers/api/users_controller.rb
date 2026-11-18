class Api::UsersController < Api::ApiController
  expose :user, id: -> { params[:id] }, scope: -> { User }, find_by: :slug

  strong_params :user, permit: [:email, :password, :active, :time_zone]

  # @route POST /api/users (api_users)
  def create
  end

  # @route PATCH /api/users/:id (api_user)
  # @route PUT /api/users/:id (api_user)
  def update
    authorize user
    if user.update(user_params)
      render json: user.render, status: :ok
    else
      render json: { errors: user.errors }, status: :unprocessable_content
    end
  end

  # @route PATCH /api/users/:id/update_table_preferences (api_update_table_preferences)
  def update_table_preferences
    authorize user, :update?
    preferences = (user.table_preferences || {}).deep_dup
    incoming = params.require(:user).require(:table_preferences).permit!.to_h
    incoming.each do |model_key, model_prefs|
      prefs = model_prefs.to_h
      if prefs["hide"].is_a?(Hash)
        prefs["hide"] = prefs["hide"].transform_values { |value| ActiveModel::Type::Boolean.new.cast(value) }
      end
      preferences[model_key] = prefs
    end
    user.update!(table_preferences: preferences)
    render json: user.render, status: :ok
  end

  # @route PATCH /api/users/:id/update_user_preferences (api_update_user_preferences)
  def update_user_preferences
    authorize user, :update?
    preferences = (user.user_preferences || {}).deep_dup
    incoming = params.require(:user).require(:user_preferences).permit!.to_h
    user.update!(user_preferences: preferences.merge(incoming))
    render json: user.render, status: :ok
  end
end
