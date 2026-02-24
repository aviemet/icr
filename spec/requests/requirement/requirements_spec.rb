require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "/requirement/requirements", type: :request do
  login_user(:admin)

  def valid_attributes
    requirement_type = create(:requirement_type)
    {
      requirement: {
        **attributes_for(:requirement).except(:requirement_type_id),
        requirement_type_id: requirement_type.id
      }
    }
  end

  def invalid_attributes
    {
      requirement: { requirement_type_id: nil }
    }
  end

  def new_attributes
    attributes_for(:requirement).slice(:name, :description)
  end

  describe "GET /index" do
    it "renders a successful response" do
      create(:requirement)
      get requirements_url
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      requirement = create(:requirement)
      get requirement_url(requirement)
      expect(response).to be_successful
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_requirement_url
      expect(response).to be_successful
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      requirement = create(:requirement)
      get edit_requirement_url(requirement)
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Requirement::Requirement" do
        expect {
          post requirements_url, params: valid_attributes
        }.to change(Requirement::Requirement, :count).by(1)
      end

      it "redirects to the created requirement_requirement" do
        post requirements_url, params: valid_attributes
        expect(response).to redirect_to(requirement_url(Requirement::Requirement.last))
      end
    end

    context "with invalid parameters" do
      it "does not create a new Requirement::Requirement" do
        expect {
          post requirements_url, params: invalid_attributes
        }.not_to change(Requirement::Requirement, :count)
      end

      it "redirects to new requirement" do
        post requirements_url, params: invalid_attributes
        expect(response).to redirect_to(new_requirement_path)
      end
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      it "updates the requested requirement_requirement" do
        requirement = create(:requirement)
        attrs = new_attributes
        patch requirement_url(requirement), params: { requirement: attrs }
        requirement.reload
        expect(requirement.name).to eq(attrs[:name])
        expect(requirement.description).to eq(attrs[:description])
      end

      it "redirects to the requirement_requirement" do
        requirement = create(:requirement)
        patch requirement_url(requirement), params: { requirement: new_attributes }
        requirement.reload
        expect(response).to redirect_to(requirement_url(requirement))
      end
    end

    context "with invalid parameters" do
      it "redirects to edit requirement" do
        requirement = create(:requirement)
        patch requirement_url(requirement), params: invalid_attributes
        expect(response).to redirect_to(edit_requirement_path(requirement))
      end
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested requirement_requirement" do
      requirement = create(:requirement)
      expect {
        delete requirement_url(requirement)
      }.to change(Requirement::Requirement, :count).by(-1)
    end

    it "redirects to the requirements list" do
      requirement = create(:requirement)
      delete requirement_url(requirement)
      expect(response).to redirect_to(requirements_url)
    end
  end
end
