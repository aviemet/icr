require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Api::Employees", type: :request do
  login_user(:admin)

  describe "GET /options" do
    it "returns option data for all employees" do
      employees = create_list(:employee, 2)

      get api_employees_options_url
      expect(response).to be_successful

      json = response.parsed_body
      slugs = employees.map(&:slug)

      expect(json).not_to be_empty
      expect(json.pluck("slug")).to include(*slugs)
    end
  end
end
