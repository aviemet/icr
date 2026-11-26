require "rails_helper"

RSpec.describe CreateShiftsFromTemplateJob, type: :job do
  describe "#perform" do
    it "creates shifts for active template" do
      template = build_stubbed(:shift_template, :recurring)
      start_date = Date.current

      allow(ShiftTemplate).to receive(:find_by).with(id: template.id).and_return(template)
      allow(ShiftTemplateApplicator).to receive(:apply)
        .with(template, start_date)
        .and_return(true)

      described_class.new.perform(template.id, start_date)

      expect(ShiftTemplateApplicator).to have_received(:apply)
        .with(template, start_date)
    end

    it "does not create shifts for inactive template" do
      template = build_stubbed(:shift_template, :inactive)
      start_date = Date.current

      allow(ShiftTemplate).to receive(:find_by).with(id: template.id).and_return(template)
      allow(ShiftTemplateApplicator).to receive(:apply)

      described_class.new.perform(template.id, start_date)

      expect(ShiftTemplateApplicator).not_to have_received(:apply)
    end

    it "handles missing template gracefully" do
      template_id = SecureRandom.uuid
      allow(ShiftTemplate).to receive(:find_by).with(id: template_id).and_return(nil)
      allow(ShiftTemplateApplicator).to receive(:apply)

      described_class.new.perform(template_id, Date.current)

      expect(ShiftTemplateApplicator).not_to have_received(:apply)
    end
  end
end
