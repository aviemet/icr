class PagesController < ApplicationController
  # @route GET / (root)
  # @route GET /settings (settings)
  def index
    render inertia: "Home", props: {
      name: "World",
    }
  end
end
