require "tzinfo"

def formatted_timezone_list
  TZInfo::Timezone.all_country_zones
    .map do |zone|
    current_time = zone.now
    utc_offset_seconds = zone.current_period.utc_offset
    utc_offset = current_time.strftime("%z")
    formatted_offset = "#{utc_offset[0..2]}:#{utc_offset[3..4]}"

    # Extract region from the identifier (first part before the slash)
    region = zone.friendly_identifier.split("/").first

    {
      formatted_string: "#{zone.friendly_identifier} (UTC #{formatted_offset})",
      sort_key: utc_offset_seconds,
      region: region,
      identifier: zone.identifier
    }
  end
    .group_by { |item| item[:region].split(" - ").first }
    .sort_by { |region, _| region == "America" ? "" : region }
    .to_h
    .transform_values do |items|
    items.sort_by { |item| item[:sort_key] }
      .map { |item|
        {
          value: item[:identifier],
          label: item[:formatted_string]
        }
      }
  end
end

def formatted_currencies_list
  Monetize::Parser::CURRENCY_SYMBOLS
    .uniq(&:last)
    .map{ |sym, abbr| { symbol: sym, code: abbr } }
end
