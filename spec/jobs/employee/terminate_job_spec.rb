# frozen_string_literal: true

require "rails_helper"

RSpec.describe Employee::TerminateJob do
  around do |example|
    travel_to(Time.zone.local(2026, 4, 13, 12, 0, 0)) { example.run }
  end

  it "terminates an employed employee whose inactive_at is due" do
    employee = create(:employee, :employed)
    employee.update!(inactive_at: 1.minute.ago, termination_reason: "Done")

    described_class.perform_now(employee.id)

    expect(employee.reload).to be_terminated
  end

  it "no-ops when inactive_at is still in the future" do
    employee = create(:employee, :employed)
    employee.update!(inactive_at: 1.day.from_now, termination_reason: "Later")

    described_class.perform_now(employee.id)

    expect(employee.reload).to be_employed
  end

  it "applies a per-employee concurrency label" do
    employee = create(:employee, :employed)
    job = described_class.new(employee.id)

    expect(job.good_job_labels).to eq([described_class.label_for(employee.id)])
  end
end
