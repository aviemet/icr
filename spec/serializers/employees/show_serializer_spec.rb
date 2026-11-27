require "rails_helper"

RSpec.describe Employees::ShowSerializer do
  it "includes current pay period id and slug" do
    employee = create(:employee)
    period_start_date, period_end_date = Payroll::Period.period_dates
    pay_period = create(
      :pay_period,
      starts_at: period_start_date.to_time.beginning_of_day,
      ends_at: period_end_date.to_time.end_of_day,
      approved_at: nil,
      finalized_at: nil,
    )

    payload = described_class.render(employee)

    expect(payload[:current_pay_period_id]).to eq(pay_period.id)
    expect(payload[:current_pay_period_slug]).to eq(pay_period.slug)
  end

  it "renders without raising when no current pay period exists" do
    employee = create(:employee)

    expect { described_class.render(employee) }.not_to raise_error
  end
end
