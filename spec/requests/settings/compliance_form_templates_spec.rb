require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "/settings/compliance_form_templates", type: :request do
  login_user(:admin)

  before { Flipper.enable(:compliance_forms) }

  it "lists templates" do
    template = Compliance::HazardAssessmentSeed.ensure!
    get settings_compliance_form_templates_url
    expect(response).to be_successful
    expect(inertia.props[:form_templates].pluck(:id)).to include(template.id)
  end

  it "shows template sections and items" do
    template = Compliance::HazardAssessmentSeed.ensure!
    get settings_compliance_form_template_url(template.slug)
    expect(response).to be_successful
    props = inertia.props[:form_template]
    expect(props[:id]).to eq(template.id)
    expect(props[:slug]).to eq(template.slug)
    expect(props[:form_sections].length).to eq(3)
  end
end
