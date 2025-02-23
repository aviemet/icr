# spec/queries/date_range_query_spec.rb
require "rails_helper"

RSpec.describe DateRangeCalculator do
  around do |example|
    Time.use_zone("UTC") { example.run }
  end

  describe "#call" do
    context "with month view" do
      it "returns correct range for specific month" do
        params = {
          view: "month",
          year: 2024,
          month: "February"
        }

        start_date, end_date = described_class.new(params).call

        # February 2024 starts on a Thursday, so start_date should be the previous Sunday
        expect(start_date).to eq(Time.zone.local(2024, 1, 28).beginning_of_day)
        # February 2024 ends on a Thursday, so end_date should be the next Saturday
        expect(end_date).to eq(Time.zone.local(2024, 3, 2).end_of_day)
      end

      it "handles numeric month input" do
        params = {
          view: "month",
          year: 2024,
          month: 2
        }

        start_date, end_date = described_class.new(params).call

        expect(start_date).to eq(Time.zone.local(2024, 1, 28).beginning_of_day)
        expect(end_date).to eq(Time.zone.local(2024, 3, 2).end_of_day)
      end

      it "defaults to current month when no params given" do
        params = { view: "month" }
        current_time = Time.zone.local(2024, 2, 15)
        allow(Time).to receive(:current).and_return(current_time)

        start_date, end_date = described_class.new(params).call

        expect(start_date).to eq(Time.zone.local(2024, 1, 28).beginning_of_day)
        expect(end_date).to eq(Time.zone.local(2024, 3, 2).end_of_day)
      end
    end

    context "with week view" do
      it "returns correct range for specific date" do
        params = {
          view: "week",
          date: "2024-02-15"
        }

        start_date, end_date = described_class.new(params).call

        expect(start_date).to eq(Time.zone.local(2024, 2, 12))  # Monday
        expect(end_date).to eq(Time.zone.local(2024, 2, 18).end_of_day)  # Sunday
      end

      it "defaults to current week when no date given" do
        params = { view: "week" }
        current_time = Time.zone.local(2024, 2, 15)
        allow(Time).to receive(:current).and_return(current_time)

        start_date, end_date = described_class.new(params).call

        expect(start_date).to eq(Time.zone.local(2024, 2, 12))  # Monday
        expect(end_date).to eq(Time.zone.local(2024, 2, 18).end_of_day)  # Sunday
      end
    end

    context "with day view" do
      it "returns correct range for specific date" do
        params = {
          view: "day",
          date: "2024-02-15"
        }

        start_date, end_date = described_class.new(params).call

        expect(start_date).to eq(Time.zone.local(2024, 2, 15).beginning_of_day)
        expect(end_date).to eq(Time.zone.local(2024, 2, 15).end_of_day)
      end

      it "defaults to current day when no date given" do
        params = { view: "day" }
        current_time = Time.zone.local(2024, 2, 15, 14, 30)  # 2:30 PM
        allow(Time).to receive(:current).and_return(current_time)

        start_date, end_date = described_class.new(params).call

        expect(start_date).to eq(Time.zone.local(2024, 2, 15).beginning_of_day)
        expect(end_date).to eq(Time.zone.local(2024, 2, 15).end_of_day)
      end
    end

    context "with agenda view" do
      it "returns correct range for specific start and end dates" do
        params = {
          view: "agenda",
          start: "2024-02-15",
          end: "2024-03-15"
        }

        start_date, end_date = described_class.new(params).call

        expect(start_date).to eq(Time.zone.local(2024, 2, 15))
        expect(end_date).to eq(Time.zone.local(2024, 3, 15).end_of_day)
      end

      it "defaults to 30 days from start when no end date given" do
        params = {
          view: "agenda",
          start: "2024-02-15"
        }

        start_date, end_date = described_class.new(params).call

        expect(start_date).to eq(Time.zone.local(2024, 2, 15))
        expect(end_date).to eq(Time.zone.local(2024, 3, 16).end_of_day)  # 30 days later
      end

      it "defaults to current time and 30 days when no params given" do
        params = { view: "agenda" }
        current_time = Time.zone.local(2024, 2, 15)
        allow(Time).to receive(:current).and_return(current_time)

        start_date, end_date = described_class.new(params).call

        expect(start_date).to eq(Time.zone.local(2024, 2, 15).beginning_of_day)
        expect(end_date).to eq(Time.zone.local(2024, 3, 16).end_of_day)  # 30 days later
      end
    end

    context "with invalid inputs" do
      it "handles invalid month names gracefully" do
        params = {
          view: "month",
          year: 2024,
          month: "Invalid"
        }

        expect {
          described_class.new(params).call
        }.to raise_error(Date::Error)
      end

      it "handles invalid dates gracefully" do
        params = {
          view: "day",
          date: "not-a-date"
        }

        expect {
          described_class.new(params).call
        }.to raise_error(ArgumentError)
      end
    end

    context "with default view" do
      it "defaults to month view when no view specified" do
        current_time = Time.zone.local(2024, 2, 15)
        allow(Time).to receive(:current).and_return(current_time)

        start_date, end_date = described_class.new.call

        expect(start_date).to eq(Time.zone.local(2024, 1, 28).beginning_of_day)
        expect(end_date).to eq(Time.zone.local(2024, 3, 2).end_of_day)
      end
    end
  end
end
