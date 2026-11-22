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

    range_start, range_end = DateRangeCalculator.new(params).call
    masters = if client
                client.schedule_events_between(range_start, range_end)
              else
                Calendar::Event.none
              end

    render inertia: "Home", props: {
      schedules: lambda {
        Calendar::RenderSchedule.call(
          events: masters,
          range_start: range_start,
          range_end: range_end,
          view: :show,
        )
      },
    }
  end
end
