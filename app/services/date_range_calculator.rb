class DateRangeCalculator
  def initialize(params = {})
    @params = params
  end

  def call
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

  private

  attr_reader :params

  def view
    params[:view] || "month"
  end

  def reference_date
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
    Time.zone.parse(params[:date]) if params[:date]
  end
end
