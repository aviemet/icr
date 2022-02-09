class PagesController < InertiaController
  def index
    render inertia: "Home", props: {
      name: "World",
    }
  end
end
