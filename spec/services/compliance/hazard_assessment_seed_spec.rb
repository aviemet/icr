require "rails_helper"

RSpec.describe Compliance::HazardAssessmentSeed do
  it "seeds the hazard assessment template with checklist sections" do
    template = described_class.ensure!

    expect(template.slug).to eq(described_class::TEMPLATE_SLUG)
    expect(template).to be_active
    expect(template).to be_system
    expect(template.form_sections.map(&:key)).to eq(%w[home_safety manual_transfers harmful_behaviors])
    expect(template.form_sections.find_by(key: "home_safety").form_items.count).to eq(25)
  end

  it "is idempotent" do
    first = described_class.ensure!
    second = described_class.ensure!
    expect(second.id).to eq(first.id)
    expect(Compliance::FormTemplate.where(slug: described_class::TEMPLATE_SLUG).count).to eq(1)
  end
end
