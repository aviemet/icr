# frozen_string_literal: true

require "rails_helper"

RSpec.describe Employee::CancelPendingTermination do
  around do |example|
    original_adapter = ActiveJob::Base.queue_adapter
    ActiveJob::Base.queue_adapter = :good_job
    travel_to(Time.zone.local(2026, 4, 13, 12, 0, 0)) { example.run }
  ensure
    ActiveJob::Base.queue_adapter = original_adapter
  end

  let(:employee) { create(:employee, :employed) }

  it "clears pending termination attributes and discards the scheduled terminate job" do
    Employee::Offboard.call(
      employee: employee,
      attrs: {
        inactive_at: Date.current + 2.days,
        termination_reason: "Leaving",
      },
    )

    label = Employee::TerminateJob.label_for(employee.id)
    queued = GoodJob::Job.unfinished.where(job_class: "Employee::TerminateJob").labeled(label)
    expect(queued.count).to eq(1)

    described_class.call(employee: employee.reload)

    employee.reload
    expect(employee.inactive_at).to be_nil
    expect(employee.termination_reason).to be_nil
    expect(employee).to be_employed
    expect(employee).not_to be_pending_termination
    expect(
      GoodJob::Job.unfinished.where(job_class: "Employee::TerminateJob").labeled(label).count,
    ).to eq(0)
  end

  it "raises when the employee is not pending termination" do
    expect {
      described_class.call(employee: employee)
    }.to raise_error(ArgumentError)
  end
end
