require "rails_helper"

RSpec.describe Payroll::SendApprovalRemindersJob, type: :job do
  it "calls the reminder service" do
    allow(Payroll::SendApprovalReminders).to receive(:call)

    described_class.new.perform

    expect(Payroll::SendApprovalReminders).to have_received(:call)
  end
end
