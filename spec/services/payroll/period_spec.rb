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

  describe ".payroll_due_date" do
    let(:period_end) { Date.new(2024, 3, 31) }

    context "with days_after_period_end" do
      before do
        Setting.payroll_due_date_rule_type = Setting::PAYROLL_DUE_DATE_RULE_TYPES[:days_after_period_end]
        Setting.payroll_due_date_days = 5
      end

      it "returns period_end + N days" do
        expect(described_class.payroll_due_date(period_end)).to eq(Date.new(2024, 4, 5))
      end
    end

    context "with day_of_week_after_period_end" do
      before do
        Setting.payroll_due_date_rule_type = Setting::PAYROLL_DUE_DATE_RULE_TYPES[:day_of_week_after_period_end]
        Setting.payroll_due_date_day_of_week = "tuesday"
      end

      it "returns the first Tuesday after period end" do
        expect(described_class.payroll_due_date(period_end)).to eq(Date.new(2024, 4, 2))
      end
    end

    context "with day_of_month" do
      before do
        Setting.payroll_due_date_rule_type = Setting::PAYROLL_DUE_DATE_RULE_TYPES[:day_of_month]
        Setting.payroll_due_date_day_of_month = "5"
      end

      it "returns the 5th of the following month" do
        expect(described_class.payroll_due_date(period_end)).to eq(Date.new(2024, 4, 5))
      end
    end
  end

  describe ".approval_window_open?" do
    let(:period_end) { Date.new(2024, 3, 31) }

    before do
      Setting.payroll_due_date_rule_type = Setting::PAYROLL_DUE_DATE_RULE_TYPES[:days_after_period_end]
      Setting.payroll_due_date_days = 5
    end

    it "returns false when today is before or on period end" do
      travel_to Date.new(2024, 3, 31) do
        expect(described_class.approval_window_open?(period_end)).to be(false)
      end
    end

    it "returns true when today is after period end and on or before due date" do
      travel_to Date.new(2024, 4, 2) do
        expect(described_class.approval_window_open?(period_end)).to be(true)
      end
    end

    it "returns false when today is after due date" do
      travel_to Date.new(2024, 4, 6) do
        expect(described_class.approval_window_open?(period_end)).to be(false)
      end
    end
  end
end
