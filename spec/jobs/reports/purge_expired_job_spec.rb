# frozen_string_literal: true

require "rails_helper"

RSpec.describe Reports::PurgeExpiredJob do
  it "destroys completed requests older than 30 days" do
    definition = create(:report_definition)
    user = create(:user).tap(&:confirm)
    stale = create(
      :report_request,
      report_definition: definition,
      requested_by: user,
      status: "complete",
      completed_at: 31.days.ago,
    )
    fresh = create(
      :report_request,
      report_definition: definition,
      requested_by: user,
      status: "complete",
      completed_at: 2.days.ago,
    )

    described_class.perform_now

    expect(ReportRequest.exists?(stale.id)).to be(false)
    expect(ReportRequest.exists?(fresh.id)).to be(true)
  end
end
