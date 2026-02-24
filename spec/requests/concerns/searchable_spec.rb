require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Searchable", type: :request do
  describe "search functionality" do
    login_user(:admin)

    it "performs basic search" do
      category = create(:category, :vendor)
      create(:vendor, name: "Acme Supplies", category: category)
      create(:vendor, name: "Acme Parts", category: category)
      create(:vendor, name: "Other Vendor", category: category)

      get vendors_path, params: { search: "Acme" }

      expect(response).to be_successful
      expect(response.body).to include("Acme Supplies")
      expect(response.body).to include("Acme Parts")
      expect(response.body).not_to include("Other Vendor")
    end

    it "handles sorting" do
      get vendors_path, params: { sort: "name", direction: "desc" }

      expect(response).to be_successful
    end
  end
end
