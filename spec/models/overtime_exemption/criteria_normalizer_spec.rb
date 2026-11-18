require "rails_helper"

RSpec.describe OvertimeExemption::CriteriaNormalizer do
  describe ".call" do
    it "coerces duration string values to numbers" do
      result = described_class.call([{
        "duration" => { "operator" => "greater_than_equal", "value" => "8" }
      }])

      expect(result).to eq([{
        "duration" => { "operator" => "greater_than_equal", "value" => 8 }
      }])
    end

    it "coerces duration between values" do
      result = described_class.call([{
        "duration" => { "operator" => "between", "value" => ["8", "12.5"] }
      }])

      expect(result).to eq([{
        "duration" => { "operator" => "between", "value" => [8, 12.5] }
      }])
    end

    it "leaves non-duration values unchanged" do
      result = described_class.call([{
        "category" => { "operator" => "equals", "value" => "sleep_shift" }
      }])

      expect(result).to eq([{
        "category" => { "operator" => "equals", "value" => "sleep_shift" }
      }])
    end

    it "stringifies field keys" do
      result = described_class.call([{
        category: { operator: "equals", value: "standby" }
      }])

      expect(result).to eq([{
        "category" => { "operator" => "equals", "value" => "standby" }
      }])
    end
  end
end
