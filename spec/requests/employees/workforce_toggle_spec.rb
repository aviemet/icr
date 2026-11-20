require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Employees index scope menu" do
  describe "as admin" do
    login_user(:admin)

    it "shows terminated employees when workforce_view=terminated" do
      terminated = create(:employee, :terminated)
      create(:employee, :employed)

      get employees_url, params: { workforce_view: "terminated" }

      expect(response).to have_http_status(:ok)
      expect(inertia.props[:can_scope_employees]).to be(true)
      expect(inertia.props[:workforce_view]).to eq("terminated")
      expect(inertia.props[:employees].pluck(:slug)).to eq([terminated.slug])
    end

    it "shows all statuses when workforce_view=all" do
      applicant = create(:employee)
      employed = create(:employee, :employed)
      terminated = create(:employee, :terminated)

      get employees_url, params: { workforce_view: "all" }

      expect(response).to have_http_status(:ok)
      expect(inertia.props[:workforce_view]).to eq("all")
      expect(inertia.props[:employees].pluck(:slug)).to contain_exactly(
        applicant.slug,
        employed.slug,
        terminated.slug,
      )
    end
  end

  describe "as facilitator" do
    let!(:facilitator_title) { Employee::JobTitle.find_by!(slug: "facilitator") }

    login_user(:employee)

    before do
      employee = create(:employee, :employed, person: @user.person)
      employee.assign_job_title(facilitator_title)
      employee.reload
    end

    it "forces employed and ignores workforce_view" do
      create(:employee, :terminated)
      employed = create(:employee, :employed)

      get employees_url, params: { workforce_view: "all" }

      expect(response).to have_http_status(:ok)
      expect(inertia.props[:can_scope_employees]).to be(false)
      expect(inertia.props[:workforce_view]).to eq("employed")
      expect(inertia.props[:employees].pluck(:status)).to all(eq("employed"))
      expect(inertia.props[:employees].pluck(:slug)).to include(employed.slug)
    end
  end
end
