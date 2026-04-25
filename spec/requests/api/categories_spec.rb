require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Api::Categories", type: :request do
  login_user(:admin)

  describe "GET /options" do
    it "returns all categories for the requested type" do
      category_type = "Contact::Email"
      create_list(:category, 2, categorizable_type: category_type)

      other_type = (Category::CATEGORIZABLE_TYPES - [category_type]).first || category_type
      create_list(:category, 3, categorizable_type: other_type)

      categories = Category.type(category_type)
      categories_count = categories.count

      get api_category_options_url(category_type)
      expect(response).to be_successful

      json = response.parsed_body
      expect(json.size).to eq(categories_count)
      expect(json.pluck("slug")).to match_array(categories.pluck(:slug))
    end
  end
end
