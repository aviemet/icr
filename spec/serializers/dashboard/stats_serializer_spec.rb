# frozen_string_literal: true

require "rails_helper"

RSpec.describe Dashboard::StatsSerializer do
  let(:payload) do
    instance_double(
      Dashboard::Stats::Payload,
      active_client_count: 2,
      inactive_client_count: 1,
      active_team_count: 4,
      hiring_pipeline_count: 3,
      week_tracked_hours: 32.5,
      pending_timesheet_count: 2,
      open_shift_count: 1,
      staffing_visible: true,
      my_upcoming_shifts: [],
      open_shifts: [],
      activity_items: [],
      pending_terminations: [],
    )
  end

  it "serializes Dashboard::Stats#payload without error" do
    expect { described_class.render(payload) }.not_to raise_error
  end

  it "serializes scalar values" do
    json = described_class.render(payload)

    expect(json[:active_client_count]).to eq(2)
  end
end
