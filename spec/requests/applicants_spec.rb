require "rails_helper"
require_relative "../support/devise"

RSpec.describe "/employees/applicants" do
  describe "GET /index" do
    login_user(:admin)

    it "renders pipeline employees and excludes workforce" do
      applicant = create(:employee)
      offered = create(:employee, :offered)
      create(:employee, :employed)
      create(:employee, :terminated)

      get applicants_url

      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component "Applicants/Index"
      slugs = inertia.props[:employees].pluck(:slug)
      expect(slugs).to contain_exactly(applicant.slug, offered.slug)
      expect(inertia.props[:pagination][:count]).to eq(2)
    end

    it "filters by declined status" do
      declined = create(:employee, :declined)
      create(:employee)

      get applicants_url, params: { adv: "true", statuses: ["declined"] }

      expect(response).to have_http_status(:ok)
      slugs = inertia.props[:employees].pluck(:slug)
      expect(slugs).to eq([declined.slug])
    end

    it "includes withdrawn when filtered" do
      withdrawn = create(:employee, :withdrawn)
      create(:employee)

      get applicants_url, params: { adv: "true", statuses: ["withdrawn"] }

      expect(response).to have_http_status(:ok)
      slugs = inertia.props[:employees].pluck(:slug)
      expect(slugs).to eq([withdrawn.slug])
    end
  end
end
