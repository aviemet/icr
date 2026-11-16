require "rails_helper"
require_relative "../support/devise"

RSpec.describe "Permissions", type: :request do
  login_user(:admin)

  describe "GET /index" do
    it "renders a successful response" do
      get permissions_url

      expect(response).to be_successful
      expect_inertia.to render_component "Permissions/Index"
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      group = create(:permission_group)

      get permission_url(group)

      expect(response).to be_successful
      expect_inertia.to render_component "Permissions/Show"
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_permission_url

      expect(response).to be_successful
      expect_inertia.to render_component "Permissions/New"
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      group = create(:permission_group)

      get edit_permission_url(group)

      expect(response).to be_successful
      expect_inertia.to render_component "Permissions/Edit"
    end
  end
end
