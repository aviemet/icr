require "rails_helper"

RSpec.describe PayrollMailer, type: :mailer do
  describe "#approval_reminder" do
    it "includes pending count, period range, and period url" do
      user = create(:user, email: "approver@example.com")
      pay_period = create(
        :pay_period,
        starts_at: Date.new(2026, 3, 1).beginning_of_day,
        ends_at: Date.new(2026, 3, 15).end_of_day,
      )
      due_date = Date.new(2026, 3, 20)
      period_url = "http://localhost:3000/payroll/periods/#{pay_period.id}"

      mail = described_class.with(
        user: user,
        pay_period: pay_period,
        pending_count: 3,
        due_date: due_date,
        period_url: period_url,
      ).approval_reminder

      expect(mail.to).to eq(["approver@example.com"])
      expect(mail.subject).to include("3 timesheets")
      expect(mail.body.encoded).to include("3 timesheets")
      expect(mail.body.encoded).to include(period_url)
      expect(mail.body.encoded).to include("March")
    end
  end
end
