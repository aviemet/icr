class PagesController < ApplicationController
  # @route GET / (root)
  def index
    render inertia: "Home", props: {
      name: "World",
    }
  end
end
