# frozen_string_literal: true

require "rails_helper"

RSpec.describe Employee::Offboard do
  include ActiveJob::TestHelper

  before do
    ActiveJob::Base.queue_adapter = :test
  end

  around do |example|
    travel_to(Time.zone.local(2026, 4, 13, 12, 0, 0)) { example.run }
  end

  let(:employee) { create(:employee, :employed) }

  it "terminates immediately when terminate_immediately is true" do
    described_class.call(
      employee: employee,
      attrs: {
        inactive_at: Date.current,
        termination_reason: "Performance",
        eligible_for_hire: false,
      },
      terminate_immediately: true,
    )

    employee.reload
    expect(employee).to be_terminated
    expect(employee.termination_reason).to eq("Performance")
    expect(employee.eligible_for_hire).to be(false)
  end

  it "schedules termination for a future date with blank time as beginning of day" do
    assert_enqueued_with(job: Employee::TerminateJob) do
      described_class.call(
        employee: employee,
        attrs: {
          inactive_at: Date.current + 3.days,
          termination_reason: "Resignation",
          eligible_for_hire: true,
        },
        terminate_immediately: false,
      )
    end

    employee.reload
    expect(employee).to be_employed
    expect(employee).to be_pending_termination
    expect(employee.inactive_at).to be_within(1.second).of((Date.current + 3.days).in_time_zone.beginning_of_day)
  end

  it "terminates immediately when last day is today with blank time" do
    described_class.call(
      employee: employee,
      attrs: {
        inactive_at: Date.current,
        termination_reason: "Resignation",
        eligible_for_hire: true,
      },
      terminate_immediately: false,
    )

    employee.reload
    expect(employee).to be_terminated
    expect(employee.inactive_at).to be_within(1.second).of(Date.current.in_time_zone.beginning_of_day)
  end

  it "combines optional time into the scheduled datetime" do
    described_class.call(
      employee: employee,
      attrs: {
        inactive_at: Date.current + 1.day,
        inactive_at_time: "15:30",
        termination_reason: "Resignation",
      },
      terminate_immediately: false,
    )

    employee.reload
    expect(employee.inactive_at).to eq(Time.zone.local(2026, 4, 14, 15, 30, 0))
  end
end
