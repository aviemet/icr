class DateRangeCalculator
  def initialize(params = {})
    @params = params
    # Store the timezone if provided
    @timezone = params[:timezone].presence
  end

  def call
    # Perform all calculations within the target timezone context
    Time.use_zone(target_zone) do
      case view
      when "month"
        month_range
      when "week"
        week_range
      when "day"
        day_range
      when "agenda"
        agenda_range
      end
    end
  end

  private

  attr_reader :params, :timezone

  # Helper to get the target timezone name, falling back to server default
  def target_zone
    @target_zone ||= timezone || Time.zone.name
  end

  def view
    params[:view] || "month"
  end

  def reference_date
    # Ensure reference date parsing/creation happens within the target timezone
    @reference_date ||= parse_date_param || Time.current
  end

  def month_range
    time = Time.zone.local(
      reference_date.year,
      reference_date.month,
      1,
    )

    [
      time.beginning_of_month.prev_occurring(:sunday),
      time.end_of_month.next_occurring(:saturday).end_of_day
    ]
  end

  def week_range
    [
      reference_date.beginning_of_week(:sunday),
      reference_date.end_of_week(:sunday).end_of_day
    ]
  end

  def day_range
    [
      reference_date.beginning_of_day,
      reference_date.end_of_day
    ]
  end

  def agenda_range
    # For agenda view, show a month from the reference date
    [
      reference_date.beginning_of_day,
      (reference_date + 30.days).end_of_day
    ]
  end

  def parse_date_param
    # Parsing also happens within the Time.use_zone block from `call`
    Time.zone.parse(params[:date]) if params[:date]
  end
end
