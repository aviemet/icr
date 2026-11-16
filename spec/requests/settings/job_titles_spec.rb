require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Settings::JobTitles", type: :request do
  login_user(:admin)

  describe "GET /index" do
    it "renders a successful response" do
      create(:job_title)

      get settings_job_titles_url

      expect(response).to be_successful
      expect_inertia.to render_component "Settings/JobTitles/Index"
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
end
