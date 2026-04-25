# frozen_string_literal: true

require "rails_helper"

RSpec.describe Dashboard::StatsSerializer do
  let(:admin) { create(:user).tap { |u| u.add_role(:admin) } }

  it "serializes Dashboard::Stats#payload without error" do
    payload = Dashboard::Stats.new(admin).payload
    expect { described_class.render(payload) }.not_to raise_error
  end

  it "includes scalar keys and nested collections" do
    payload = Dashboard::Stats.new(admin).payload
    json = described_class.render(payload)
    expect(json).to include(
      :active_client_count,
      :inactive_client_count,
      :active_team_count,
      :hiring_pipeline_count,
      :week_tracked_hours,
      :pending_timesheet_count,
      :upcoming_events,
      :activity_items,
    )
    expect(json[:upcoming_events]).to be_an(Array)
    expect(json[:activity_items]).to be_an(Array)
  end
end
