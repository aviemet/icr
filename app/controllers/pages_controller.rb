class PagesController < ApplicationController
  # @route GET / (root)
  def dashboard
    render inertia: "Dashboard", props: {}
  end

  # @route GET /home (home)
  def home
    schedules = Client
      .includes([:person])
      .first
      .calendar_events
      .includes([:recurring_patterns, shift: [employee: [:person, :job_title, :calendar_customization]]])
      .between(*DateRangeCalculator.new(params).call)

    render inertia: "Home", props: {
      schedules: lambda {
        schedules.render(:show)
      },
    }
  end
end
