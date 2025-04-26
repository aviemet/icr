require "rails_helper"

RSpec.describe Payroll::Period do
  describe ".period_dates" do
    context "with weekly periods" do
      before do
        Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:weekly]
        Setting.payroll_period_day = "monday"
      end

      it "returns correct period for mid-week date" do
        # March 15, 2024 is a Friday
        reference_date = Date.new(2024, 3, 15)
        start_date, end_date = described_class.period_dates(reference_date)

        expect(start_date).to eq(Date.new(2024, 3, 11)) # Monday
        expect(end_date).to eq(Date.new(2024, 3, 17))   # Sunday
      end

      it "handles different start days" do
        Setting.payroll_period_day = "wednesday"
        reference_date = Date.new(2024, 3, 15)
        start_date, end_date = described_class.period_dates(reference_date)

        expect(start_date).to eq(Date.new(2024, 3, 13)) # Wednesday
        expect(end_date).to eq(Date.new(2024, 3, 19))   # Tuesday
      end
    end

    context "with bi-weekly periods" do
      before do
        Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:bi_weekly]
        Setting.payroll_period_day = "monday"
      end

      it "returns correct period for mid-period date" do
        # Assuming 2024-01-01 is a period start
        reference_date = Date.new(2024, 3, 15)
        start_date, end_date = described_class.period_dates(reference_date)

        expect(start_date).to eq(Date.new(2024, 3, 11)) # Monday
        expect(end_date).to eq(Date.new(2024, 3, 24))   # Sunday
      end

      it "handles different start days" do
        Setting.payroll_period_day = "wednesday"
        reference_date = Date.new(2024, 3, 15)
        start_date, end_date = described_class.period_dates(reference_date)

        expect(start_date).to eq(Date.new(2024, 3, 13)) # Wednesday
        expect(end_date).to eq(Date.new(2024, 3, 26))   # Tuesday
      end
    end

    context "with semi-monthly periods" do
      before do
        Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:semi_monthly]
        Setting.payroll_period_date = "1"
        Setting.payroll_period_date_2 = "15"
      end

      it "returns correct period for date in first half" do
        test_date = Date.new(2024, 3, 7)
        start_date, end_date = described_class.period_dates(test_date)

        expect(start_date).to eq(Date.new(2024, 3, 1))
        expect(end_date).to eq(Date.new(2024, 3, 14))
      end

      it "returns correct period for date in second half" do
        test_date = Date.new(2024, 3, 20)
        start_date, end_date = described_class.period_dates(test_date)

        expect(start_date).to eq(Date.new(2024, 3, 15))
        expect(end_date).to eq(Date.new(2024, 3, 31))
      end

      it "handles last day of month setting" do
        Setting.payroll_period_date_2 = "-1"
        test_date = Date.new(2024, 3, 20)
        start_date, end_date = described_class.period_dates(test_date)

        expect(start_date).to eq(Date.new(2024, 3, 15))
        expect(end_date).to eq(Date.new(2024, 3, 31))
      end
    end

    context "with monthly periods" do
      before do
        Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:monthly]
        Setting.payroll_period_date = "1"
      end

      it "returns correct period for mid-month date" do
        reference_date = Date.new(2024, 3, 15)
        start_date, end_date = described_class.period_dates(reference_date)

        expect(start_date).to eq(Date.new(2024, 3, 1))
        expect(end_date).to eq(Date.new(2024, 3, 31))
      end

      it "handles custom start date" do
        Setting.payroll_period_date = "15"
        reference_date = Date.new(2024, 3, 15)
        start_date, end_date = described_class.period_dates(reference_date)

        expect(start_date).to eq(Date.new(2024, 3, 15))
        expect(end_date).to eq(Date.new(2024, 4, 14))
      end

      it "handles last day of month setting" do
        Setting.payroll_period_date = "-1"
        reference_date = Date.new(2024, 3, 15)
        start_date, end_date = described_class.period_dates(reference_date)

        expect(start_date).to eq(Date.new(2024, 2, 29)) # February is leap year
        expect(end_date).to eq(Date.new(2024, 3, 30))
      end
    end
  end

  describe ".previous_period_dates" do
    before do
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:monthly]
      Setting.payroll_period_date = "1"
    end

    it "returns the previous period dates" do
      reference_date = Date.new(2024, 3, 15)
      start_date, end_date = described_class.previous_period_dates(reference_date)

      expect(start_date).to eq(Date.new(2024, 2, 1))
      expect(end_date).to eq(Date.new(2024, 2, 29)) # Leap year
    end
  end

  describe ".next_period_dates" do
    before do
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:monthly]
      Setting.payroll_period_date = "1"
    end

    it "returns the next period dates" do
      reference_date = Date.new(2024, 3, 15)
      start_date, end_date = described_class.next_period_dates(reference_date)

      expect(start_date).to eq(Date.new(2024, 4, 1))
      expect(end_date).to eq(Date.new(2024, 4, 30))
    end
  end
end
