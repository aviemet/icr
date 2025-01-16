require "rails_helper"

RSpec.describe "Searchable", type: :request do
  # Example using Users controller
  describe "search functionality" do
    before do
      create(:user, email: "test1@example.com")
      create(:user, email: "test2@example.com")
      create(:user, email: "other@example.com")
    end

    it "performs basic search" do
      sign_in create(:user)
      get users_path, params: { search: "test" }

      expect(response).to be_successful
      expect(response.body).to include("test1@example.com")
      expect(response.body).to include("test2@example.com")
      expect(response.body).not_to include("other@example.com")
    end

    it "handles sorting" do
      sign_in create(:user)
      get users_path, params: { sort: "email", direction: "desc" }

      expect(response).to be_successful
      # Add expectations based on your sorting implementation
    end
  end
end
