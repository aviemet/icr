require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Api::Clients", type: :request do
  login_user(:admin)

  describe "GET /options" do
    it "returns option data for all clients" do
      clients = create_list(:client, 2)

      get api_clients_options_url
      expect(response).to be_successful

      json = response.parsed_body
      slugs = clients.map(&:slug)

      expect(json).not_to be_empty
      expect(json.pluck("slug")).to include(*slugs)
    end
  end
end
