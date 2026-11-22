class PagesController < ApplicationController
  # @route GET / (root)
  def dashboard
    authorize :dashboard, :show?

    render inertia: "Dashboard", props: {
      dashboard: Dashboard::StatsSerializer.render(Dashboard::Stats.new(current_user).payload),
    }
  end

  # @route GET /home (home)
  def home
    client = policy_scope(Client.includes([:person])).first
    authorize client, :schedule? if client

    schedules = if client
                  client.schedule_events_between(*DateRangeCalculator.new(params).call)
                else
                  Calendar::Event.none
                end

    render inertia: "Home", props: {
      schedules: lambda {
        schedules.render(:show)
      },
    }
  end
end
