require "rails_helper"

RSpec.describe CreateShiftsFromTemplateJob, type: :job do
  describe "#perform" do
    it "creates shifts for active template" do
      template = create(:shift_template, :recurring)
      create(:shift_template_entry, shift_template: template)
      start_date = Date.current

      expect(ShiftTemplateApplicator).to receive(:apply)
        .with(template, start_date)
        .and_return(true)

      described_class.new.perform(template.id, start_date)
    end

    it "does not create shifts for inactive template" do
      template = create(:shift_template, :inactive)
      start_date = Date.current

      expect(ShiftTemplateApplicator).not_to receive(:apply)

      described_class.new.perform(template.id, start_date)
    end

    it "handles missing template gracefully" do
      expect(ShiftTemplateApplicator).not_to receive(:apply)

      described_class.new.perform(-1, Date.current)
    end
  end
end
