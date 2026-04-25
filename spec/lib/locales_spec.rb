require "rails_helper"

require_relative "../../lib/locales"

RSpec.describe Locales do
  describe ".formatted_timezone_list" do
    it "returns a hash of regions to timezone options" do
      result = described_class.formatted_timezone_list
      expect(result).to be_a(Hash)
      expect(result.keys).to all(be_a(String))
      result.each_value do |items|
        expect(items).to be_an(Array)
        expect(items).to all(include(:value, :label))
      end
    end

    it "includes America region" do
      result = described_class.formatted_timezone_list
      expect(result).to have_key("America")
      expect(result["America"].first).to include(:value, :label)
    end
  end

  describe ".formatted_currencies_list" do
    it "returns an array of hashes with symbol and code" do
      result = described_class.formatted_currencies_list
      expect(result).to be_an(Array)
      expect(result).to all(include(:symbol, :code))
    end

    it "includes common currencies" do
      result = described_class.formatted_currencies_list
      codes = result.pluck(:code)
      expect(codes).to include("USD")
      expect(codes).to include("EUR")
    end
  end
end
