require_relative "../../../lib/locales"

class Api::LocalesController < Api::ApiController
  # @route GET /api/options/locales/currencies (api_currencies)
  def currencies
    render json: formatted_currencies_list
  end

  # @route GET /api/options/locales/timezones (api_timezones)
  def timezones
    render json: formatted_timezone_list
  end

  # @route GET /api/options/locales/languages (api_languages)
  def languages
    # TODO: when there are more locale translations, this should generate available languages from available ones
    render json: [{ value: "en", label: "English" }]
  end

  # @route GET /api/options/locales/pay_periods (api_pay_periods)
  def pay_periods
    render json: Setting::PAY_PERIOD_TYPES.map { |_key, value| { value:, label: value.split("_").map(&:capitalize).join(" ") } }
  end

end
