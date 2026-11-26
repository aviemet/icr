# frozen_string_literal: true

require "rails_helper"

RSpec.describe TimeOff::SubmitRequest do
  it "creates a pending request" do
    employee = create(:employee)

    request = described_class.call(
      employee: employee,
      kind: :pto,
      starts_at: 1.week.from_now.change(hour: 9),
      ends_at: 1.week.from_now.change(hour: 17),
      hours: 8,
    )

    expect(request).to be_pending
    expect(request.hours).to eq(8)
  end

  it "raises when hours are not positive" do
    employee = create(:employee)

    expect {
      described_class.call(
        employee: employee,
        kind: :pto,
        starts_at: 1.week.from_now.change(hour: 9),
        ends_at: 1.week.from_now.change(hour: 17),
        hours: 0,
      )
    }.to raise_error(TimeOff::SubmitRequest::Error, /positive/)
  end
end
