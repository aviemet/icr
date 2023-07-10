class ClientActivitiesController < ApplicationController
  include Searchable

  expose :client_activities, -> { search(ClientActivity.includes_associated, sortable_fields) }
    expose :client_activity, find: ->(id, scope){ scope.includes_associated.find(id) }
  
  # GET /client_activities
  def index
    authorize client_activities
    render inertia: "ClientActivities/Index", props: {
      client_activities: -> { client_activities.render }
    }
  end

  # GET /client_activities/:id
  def show
    authorize client_activity
    render inertia: "ClientActivities/Show", props: {
      client_activity: -> { client_activity.render }
    }
  end

  # GET /client_activities/new
  def new
    authorize ClientActivity.new
    render inertia: "ClientActivities/New", props: {
      client_activity: ClientActivity.new.render
    }
  end

  # GET /client_activities/:id/edit
  def edit
    authorize client_activity
    render inertia: "ClientActivities/Edit", props: {
      client_activity: client_activity.render
    }
  end

  # POST /client_activities
  def create
    authorize ClientActivity.new
    if client_activity.save
      redirect_to client_activity, notice: "Client activity was successfully created."
    else
      redirect_to new_client_activity_path, inertia: { errors: client_activity.errors }
    end
  end

  # PATCH/PUT /client_activities/:id
  def update
    authorize client_activity
    if client_activity.update(client_activity_params)
      redirect_to client_activity, notice: "Client activity was successfully updated."
    else
      redirect_to edit_client_activity_path, inertia: { errors: client_activity.errors }
    end
  end

  # DELETE /client_activities/:id
  def destroy
    authorize client_activity
    client_activity.destroy
    redirect_to client_activities_url, notice: "Client activity was successfully destroyed."
  end

  private

  def sortable_fields
    %w(title notes).freeze
  end

  def client_activity_params
    params.require(:client_activity).permit(:title, :notes)
  end
end
