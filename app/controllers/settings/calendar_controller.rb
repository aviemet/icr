class Settings::CalendarController < ApplicationController
  # @route GET /settings/calendar (settings_calendar)
  def show
    authorize Setting

    render inertia: "Settings/Calendar", props: {
      settings: -> { Setting.render },
      shift_types: -> { Category.type "Shift" }
    }
  end
end
