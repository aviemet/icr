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
    case view
    when "month"
      parse_month_params || parse_date_param || Time.current
    when "agenda"
      parse_date_param(:start) || Time.current
    else
      parse_date_param || Time.current
    end
  end

  def month_range
    first_day = day_symbol_from_setting
    time = Time.zone.local(reference_date.year, reference_date.month, 1)
    [
      time.beginning_of_month.prev_occurring(first_day),
      time.end_of_month.next_occurring(day_before(first_day)).end_of_day
    ]
  end

  def week_range
    first_day = day_symbol_from_setting
    [
      reference_date.beginning_of_week(first_day),
      reference_date.end_of_week(first_day).end_of_day
    ]
  end

  def day_range
    [
      reference_date.beginning_of_day,
      reference_date.end_of_day
    ]
  end

  def agenda_range
    end_date = parse_date_param(:end) || (reference_date + 30.days)
    [
      reference_date.beginning_of_day,
      end_date.end_of_day
    ]
  end

  def parse_date_param(key = :date)
    return nil unless params[key]

    parsed = Time.zone.parse(params[key])
    raise ArgumentError, "Invalid date format: #{params[key]}" if parsed.nil?

    parsed
  rescue ArgumentError, TypeError
    raise ArgumentError, "Invalid date format: #{params[key]}"
  end

  def parse_month_params
    return nil unless params[:year] && params[:month]

    month = parse_month(params[:month])
    return nil unless month

    Time.zone.local(params[:year], month, 1)
  end

  def parse_month(month_param)
    return nil unless month_param

    if month_param.is_a?(Integer)
      raise Date::Error, "Invalid month: #{month_param}" unless (1..12).include?(month_param)

      month_param
    elsif month_param.is_a?(String)
      month_index = Date::MONTHNAMES.index(month_param.capitalize) || Date::ABBR_MONTHNAMES.index(month_param.capitalize)
      raise Date::Error, "Invalid month: #{month_param}" unless month_index

      month_index
    end
  end

  def day_symbols
    [:sunday, :monday, :tuesday, :wednesday, :thursday, :friday, :saturday]
  end

  def day_symbol_from_setting
    day_number = begin
      Setting.first_day_of_week
    rescue NoMethodError, TypeError
      record = Setting.find_by(var: "first_day_of_week")
      record ? record.value.to_i : 0
    end
    day_symbols[day_number]
  end

  def day_before(day_symbol)
    current_index = day_symbols.index(day_symbol)
    previous_index = (current_index - 1) % 7
    day_symbols[previous_index]
  end
end
