require "rails_helper"

RSpec.describe Payroll::ApplyAdjustment do
  describe ".call" do
    it "clears approved_at when the change set sets it blank" do
      timesheet = create(:timesheet, approved_at: Date.current)

      described_class.call(timesheet, { "approved_at" => nil })

      expect(timesheet.reload.approved_at).to be_nil
    end

    it "updates hour totals from the change set" do
      timesheet = create(:timesheet, total_regular_hours: 40, total_ot_hours: 2)

      described_class.call(
        timesheet,
        {
          "total_regular_hours" => 38,
          "total_ot_hours" => 0,
        },
      )

      timesheet.reload
      expect(timesheet.total_regular_hours).to eq(38)
      expect(timesheet.total_ot_hours).to eq(0)
    end

    it "does nothing when timesheet is nil" do
      expect { described_class.call(nil, { "approved_at" => nil }) }.not_to raise_error
    end
  end
end
