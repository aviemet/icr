require "rails_helper"

RSpec.describe ScheduleUpcomingShiftsJob, type: :job do
  describe "#perform" do
    it "schedules jobs for active recurring templates" do
      template1 = create(:shift_template, :recurring, frequency: :weekly)
      template2 = create(:shift_template, :recurring, frequency: :monthly)
      # Inactive template that should be skipped
      create(:shift_template, :inactive, frequency: :weekly)

      expect {
        described_class.new.perform
      }.to have_enqueued_job(CreateShiftsFromTemplateJob)
        .with(template1.id, 1.week.from_now.to_date)
        .and have_enqueued_job(CreateShiftsFromTemplateJob)
        .with(template2.id, 1.month.from_now.to_date)
    end

    it "skips templates past their end date" do
      create(:shift_template, :recurring,
        frequency: :weekly,
        end_date: 2.days.from_now,)

      expect {
        described_class.new.perform
      }.not_to have_enqueued_job(CreateShiftsFromTemplateJob)
    end

    it "handles different frequencies correctly" do
      template = create(:shift_template, :recurring, frequency: :biweekly)

      expect {
        described_class.new.perform
      }.to have_enqueued_job(CreateShiftsFromTemplateJob)
        .with(template.id, 2.weeks.from_now.to_date)
    end
  end
end
