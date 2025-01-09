require "rails_helper"

RSpec.describe "/settings", type: :request do

  let(:valid_attributes) {
    skip("Add a hash of attributes valid for your model")
  }

  let(:invalid_attributes) {
    skip("Add a hash of attributes invalid for your model")
  }

  describe "GET /index" do
    it "renders a successful response" do
      Setting.create! valid_attributes
      get settings_url
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Setting" do
        expect {
          post settings_url, params: { setting: valid_attributes }
        }.to change(Setting, :count).by(1)
      end

      it "redirects to the created setting" do
        post settings_url, params: { setting: valid_attributes }
        expect(response).to redirect_to(setting_url(Setting.last))
      end
    end

    context "with invalid parameters" do
      it "does not create a new Setting" do
        expect {
          post settings_url, params: { setting: invalid_attributes }
        }.not_to change(Setting, :count)
      end

      it "renders a response with 422 status (i.e. to display the 'new' template)" do
        post settings_url, params: { setting: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      let(:new_attributes) {
        skip("Add a hash of attributes valid for your model")
      }

      it "updates the requested setting" do
        setting = Setting.create! valid_attributes
        patch setting_url(setting), params: { setting: new_attributes }
        setting.reload
        skip("Add assertions for updated state")
      end

      it "redirects to the setting" do
        setting = Setting.create! valid_attributes
        patch setting_url(setting), params: { setting: new_attributes }
        setting.reload
        expect(response).to redirect_to(setting_url(setting))
      end
    end

    context "with invalid parameters" do
      it "renders a response with 422 status (i.e. to display the 'edit' template)" do
        setting = Setting.create! valid_attributes
        patch setting_url(setting), params: { setting: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested setting" do
      setting = Setting.create! valid_attributes
      expect {
        delete setting_url(setting)
      }.to change(Setting, :count).by(-1)
    end

    it "redirects to the settings list" do
      setting = Setting.create! valid_attributes
      delete setting_url(setting)
      expect(response).to redirect_to(settings_url)
    end
  end
end
