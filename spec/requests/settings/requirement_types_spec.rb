require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "/settings/requirement_types", type: :request do
  login_user(:admin)

  def valid_attributes
    { requirement_type: attributes_for(:requirement_type) }
  end

  def invalid_attributes
    { requirement_type: { name: nil } }
  end

  describe "GET /index" do
    it "renders a successful response" do
      create(:requirement_type)
      get settings_requirement_types_url
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      requirement_type = create(:requirement_type)
      get settings_requirement_type_url(requirement_type)
      expect(response).to be_successful
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_settings_requirement_type_url
      expect(response).to be_successful
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      requirement_type = create(:requirement_type)
      get edit_settings_requirement_type_url(requirement_type)
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    it "creates a requirement type" do
      expect {
        post settings_requirement_types_url, params: valid_attributes
      }.to change(Requirement::Type, :count).by(1)
      expect(response).to redirect_to(settings_requirement_type_url(Requirement::Type.order(:created_at).last))
    end

    it "rejects invalid attributes" do
      expect {
        post settings_requirement_types_url, params: invalid_attributes
      }.not_to change(Requirement::Type, :count)
      expect(response).to redirect_to(new_settings_requirement_type_path)
    end
  end

  describe "PATCH /update" do
    it "updates the requirement type" do
      requirement_type = create(:requirement_type)
      patch settings_requirement_type_url(requirement_type), params: {
        requirement_type: { name: "Compliance", description: "Updated" },
      }
      requirement_type.reload
      expect(requirement_type.name).to eq("Compliance")
      expect(response).to redirect_to(settings_requirement_type_url(requirement_type))
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requirement type" do
      requirement_type = create(:requirement_type)
      expect {
        delete settings_requirement_type_url(requirement_type)
      }.to change(Requirement::Type, :count).by(-1)
      expect(response).to redirect_to(settings_requirement_types_url)
    end
  end
end
