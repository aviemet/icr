class PagesController < ApplicationController
  # @route GET / (root)
  def index
    render inertia: "Home", props: {
      name: "World",
    }
  end

  # @route GET /dashboard (dashboard)
  def dashboard
    render inertia: "Dashboard", props: {}
  end
end
