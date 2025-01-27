class PagesController < ApplicationController
  # @route GET / (root)
  def dashboard
    render inertia: "Dashboard", props: {}
  end
end
