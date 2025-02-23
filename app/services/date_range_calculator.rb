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

  # Possible params:
  # - view: "month", "week", "day", "agenda" | month | week | day | agenda |
  # - year: integer                          |   x   |      |     |        |
  # - month: integer or string               |   x   |      |     |        |
  # - date: string (YYYY-MM-DD)              |       |   x  |  x  |        |
  # - start: string (YYYY-MM-DD)             |       |      |     |    x   |
  # - end: string (YYYY-MM-DD)               |       |      |     |    x   |

  def view
    params[:view] || "month"
  end

  def month_range
    time = Time.zone.local(
      params[:year] || Time.current.year,
      parse_month(params[:month] || Date::MONTHNAMES[Time.current.month]),
      1,
    )

    [
      time.beginning_of_month.prev_occurring(:sunday),
      time.end_of_month.next_occurring(:saturday).end_of_day
    ]
  end

  def week_range
    time = parse_date_param || Time.current

    [
      time.beginning_of_week(:sunday),
      time.end_of_week(:sunday).end_of_day
    ]
  end

  def day_range
    time = parse_date_param || Time.current

    [
      time.beginning_of_day,
      time.end_of_day
    ]
  end

  def agenda_range
    start = Time.zone.parse(params[:start]) || Time.current.beginning_of_day

    [
      start,
      Time.zone.parse(params[:end]) || (start + 30.days).end_of_day
    ]
  end

  def parse_date_param
    Time.zone.parse(params[:date]) if params[:date]
  end

  def parse_month(month_param)
    return month_param if month_param.is_a?(Integer)

    begin
      Integer(month_param)
    rescue ArgumentError
      Date.parse(month_param).month
    end
  end
end
