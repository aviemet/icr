require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Api::JobTitles", type: :request do
  login_user(:admin)

  describe "GET /options" do
    it "returns option data for all job titles" do
      job_titles = create_list(:job_title, 2)

      get api_job_titles_options_url
      expect(response).to be_successful

      json = response.parsed_body
      slugs = job_titles.map(&:slug)

      expect(json).not_to be_empty
      expect(json.pluck("slug")).to include(*slugs)
    end
  end
end
