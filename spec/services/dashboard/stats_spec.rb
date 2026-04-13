# frozen_string_literal: true

require "rails_helper"

RSpec.describe Dashboard::Stats do
  around do |example|
    travel_to(Time.zone.local(2026, 4, 13, 12, 0, 0)) { example.run }
  end

  before do
    Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:weekly]
    Setting.payroll_period_day = "monday"
  end

  let(:admin) { create(:user).tap { |u| u.add_role(:admin) } }

  describe "#payload" do
    it "returns zeros and empty collections when user is nil" do
      payload = described_class.new(nil).payload

      expect(payload.active_client_count).to eq(0)
      expect(payload.upcoming_events).to eq([])
      expect(payload.activity_items).to eq([])
    end

    it "returns policy-scoped counts and payloads for an admin" do
      create(:client, active_at: 1.month.ago, inactive_at: nil)
      create(:client, active_at: 1.year.ago, inactive_at: 1.week.ago)

      create(:employee)
      employed = create(:employee, :employed)

      create(:calendar_event,
        name: "Visible event",
        starts_at: 2.hours.from_now,
        ends_at: 3.hours.from_now,)

      period_start, period_end = Payroll::Period.period_dates
      period_starts_at = period_start.to_time.beginning_of_day
      period_ends_at = period_end.to_time.end_of_day
      PayPeriod.find_by(starts_at: period_starts_at, ends_at: period_ends_at) ||
        PayPeriod.create!(starts_at: period_starts_at, ends_at: period_ends_at)

      week_event = create(:calendar_event,
        starts_at: Time.zone.local(2026, 4, 15, 9, 0, 0),
        ends_at: Time.zone.local(2026, 4, 15, 17, 0, 0),)
      create(:shift, employee: employed, calendar_event: week_event)

      payload = described_class.new(admin).payload

      expect(payload.active_client_count).to eq(1)
      expect(payload.inactive_client_count).to eq(1)
      expect(payload.active_team_count).to eq(1)
      expect(payload.hiring_pipeline_count).to eq(1)
      expect(payload.upcoming_events.map(&:name)).to include("Visible event")
      expect(payload.week_tracked_hours).to be_within(0.01).of(8.0)
      expect(payload.pending_timesheet_count).to eq(1)
      expect(payload.activity_items.map(&:kind)).to include("client", "employee")
    end
  end
end
