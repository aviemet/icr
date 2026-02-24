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
end
