class PagesController < ApplicationController
  def index
    render inertia: "Pages/Home", props: {
      name: "World",
    }
  end
end
