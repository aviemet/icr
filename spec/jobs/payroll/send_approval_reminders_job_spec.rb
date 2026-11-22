require "rails_helper"

RSpec.describe Payroll::SendApprovalRemindersJob, type: :job do
  it "calls the reminder service" do
    expect(Payroll::SendApprovalReminders).to receive(:call)

    described_class.new.perform
  end
end
