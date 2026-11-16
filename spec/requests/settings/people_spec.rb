require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Settings::People", type: :request do
  login_user(:admin)

  describe "GET /index" do
    it "renders a successful response" do
      get settings_people_url

      expect(response).to be_successful
      expect_inertia.to render_component "Settings/People/Index"
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      person = create(:person)

      get settings_person_url(person)

      expect(response).to be_successful
      expect_inertia.to render_component "Settings/People/Show"
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_settings_person_url

      expect(response).to be_successful
      expect_inertia.to render_component "Settings/People/New"
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      person = create(:person)

      get edit_settings_person_url(person)

      expect(response).to be_successful
      expect_inertia.to render_component "Settings/People/Edit"
    end
  end
end
