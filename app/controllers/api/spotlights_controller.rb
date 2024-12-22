class Api::SpotlightsController < ApplicationController

  # @route GET /api/spotlights (api_spotlights)
  def index
    render inertia: "Api::Spotlights/Index"
  end

  def show
    render inertia: "Api::Spotlights/Show"
  end

  def new
    render inertia: "Api::Spotlights/New"
  end

  def edit
    render inertia: "Api::Spotlights/Edit"
  end

  def create
  end

  def update
  end

  def destroy
  end
end
