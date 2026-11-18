require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Settings::JobTitles", type: :request do
  login_user(:admin)

  describe "GET /index" do
    it "renders all job titles without pagination" do
      create(:job_title, name: "Attendant")
      create(:job_title, name: "Director")

      get settings_job_titles_url

      expect(response).to be_successful
      expect_inertia.to render_component "Settings/JobTitles/Index"
      expect(inertia.props[:job_titles].map { |job_title| job_title[:name] }).to eq(["Attendant", "Director"])
      expect(inertia.props).not_to have_key(:pagination)
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      job_title = create(:job_title)

      get settings_job_title_url(job_title)

      expect(response).to be_successful
      expect_inertia.to render_component "Settings/JobTitles/Show"
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_settings_job_title_url

      expect(response).to be_successful
      expect_inertia.to render_component "Settings/JobTitles/New"
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      job_title = create(:job_title)

      get edit_settings_job_title_url(job_title)

      expect(response).to be_successful
      expect_inertia.to render_component "Settings/JobTitles/Edit"
    end
  end

  describe "POST /settings/job_titles" do
    it "creates a job title and redirects to the index" do
      department = create(:department)

      expect {
        post settings_job_titles_url, params: {
          job_title: {
            name: "Coordinator",
            description: "Coordinates care",
            department_id: department.id,
          },
        }
      }.to change(Employee::JobTitle, :count).by(1)

      expect(response).to redirect_to(settings_job_titles_path)
    end
  end

  describe "PATCH /settings/job_titles/:slug" do
    it "updates a job title and redirects to the index" do
      job_title = create(:job_title, name: "Attendant")

      patch settings_job_title_url(job_title), params: {
        job_title: {
          name: "Lead Attendant",
          description: job_title.description,
          department_id: job_title.department_id,
        },
      }

      expect(response).to redirect_to(settings_job_titles_path)
      expect(job_title.reload.name).to eq("Lead Attendant")
    end
  end

  describe "DELETE /settings/job_titles/:slug" do
    it "deletes the job title" do
      job_title = create(:job_title)

      expect {
        delete settings_job_title_url(job_title)
      }.to change(Employee::JobTitle, :count).by(-1)

      expect(response).to redirect_to(settings_job_titles_path)
      expect(Employee::JobTitle.exists?(job_title.id)).to be(false)
    end
  end
end

