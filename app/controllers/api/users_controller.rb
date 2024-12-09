class Api::UsersController < ApplicationController

  def index
    render inertia: "Api::Users/Index"
  end

  def show
    render inertia: "Api::Users/Show"
  end

  def new
    render inertia: "Api::Users/New"
  end

  def edit
    render inertia: "Api::Users/Edit"
  end

  # @route POST /api/users (api_users)
  def create
  end

  # @route PATCH /api/users/:id (api_user)
  # @route PUT /api/users/:id (api_user)
  def update
  end

  def destroy
  end
end
