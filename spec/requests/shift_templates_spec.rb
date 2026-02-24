require "rails_helper"
require_relative "../support/devise"

RSpec.describe "/shift_templates", type: :request do
  login_user(:admin)

  def valid_attributes
    client = create(:client)
    {
      shift_template: {
        **attributes_for(:shift_template).except(:client_id),
        client_id: client.id
      }
    }
  end

  def invalid_attributes
    {
      shift_template: { name: nil }
    }
  end

  def new_attributes
    attributes_for(:shift_template).slice(:name)
  end

  describe "GET /index" do
    it "renders a successful response" do
      create(:shift_template)
      get shift_templates_url
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      shift_template = create(:shift_template)
      get shift_template_url(shift_template)
      expect(response).to be_successful
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_shift_template_url
      expect(response).to be_successful
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      shift_template = create(:shift_template)
      get edit_shift_template_url(shift_template)
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new ShiftTemplate" do
        expect {
          post shift_templates_url, params: valid_attributes
        }.to change(ShiftTemplate, :count).by(1)
      end

      it "redirects to the created shift_template" do
        post shift_templates_url, params: valid_attributes
        expect(response).to redirect_to(shift_template_url(ShiftTemplate.last))
      end
    end

    context "with invalid parameters" do
      it "does not create a new ShiftTemplate" do
        expect {
          post shift_templates_url, params: invalid_attributes
        }.not_to change(ShiftTemplate, :count)
      end

      it "redirects to new shift_template" do
        post shift_templates_url, params: invalid_attributes
        expect(response).to redirect_to(new_shift_template_path)
      end
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      it "updates the requested shift_template" do
        shift_template = create(:shift_template)
        attrs = new_attributes
        patch shift_template_url(shift_template), params: { shift_template: attrs }
        shift_template.reload
        expect(shift_template.name).to eq(attrs[:name])
      end

      it "redirects to the shift_template" do
        shift_template = create(:shift_template)
        patch shift_template_url(shift_template), params: { shift_template: new_attributes }
        shift_template.reload
        expect(response).to redirect_to(shift_template_url(shift_template))
      end
    end

    context "with invalid parameters" do
      it "redirects to edit shift_template" do
        shift_template = create(:shift_template)
        patch shift_template_url(shift_template), params: invalid_attributes
        expect(response).to redirect_to(edit_shift_template_path(shift_template))
      end
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested shift_template" do
      shift_template = create(:shift_template)
      expect {
        delete shift_template_url(shift_template)
      }.to change(ShiftTemplate, :count).by(-1)
    end

    it "redirects to the shift_templates list" do
      shift_template = create(:shift_template)
      delete shift_template_url(shift_template)
      expect(response).to redirect_to(shift_templates_url)
    end
  end
end
