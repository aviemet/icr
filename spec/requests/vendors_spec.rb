require "rails_helper"
require_relative "../support/devise"

RSpec.describe "/vendors" do
  login_user(:admin)

  def valid_attributes
    category = create(:category, :vendor)
    {
      vendor: {
        **attributes_for(:vendor).except(:category_id),
        category_id: category.id
      }
    }
  end

  def invalid_attributes
    {
      vendor: { name: nil }
    }
  end

  def new_attributes
    attributes_for(:vendor).slice(:name, :notes)
  end

  describe "GET /index" do
    it "renders a successful response" do
      create(:vendor)
      get vendors_url
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      vendor = create(:vendor)
      get vendor_url(vendor)
      expect(response).to be_successful
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_vendor_url
      expect(response).to be_successful
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      vendor = create(:vendor)
      get edit_vendor_url(vendor)
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Vendor" do
        expect {
          post vendors_url, params: valid_attributes
        }.to change(Vendor, :count).by(1)
      end

      it "redirects to the created vendor" do
        post vendors_url, params: valid_attributes
        expect(response).to redirect_to(vendor_url(Vendor.last))
      end
    end

    context "with invalid parameters" do
      it "does not create a new Vendor" do
        expect {
          post vendors_url, params: invalid_attributes
        }.not_to change(Vendor, :count)
      end

      it "redirects back to the new vendor page" do
        post vendors_url, params: invalid_attributes
        expect(response).to redirect_to(new_vendor_url)
      end
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      it "updates the requested vendor" do
        vendor = create(:vendor)
        attrs = new_attributes
        patch vendor_url(vendor), params: { vendor: attrs }
        vendor.reload
        expect(vendor.name).to eq(attrs[:name])
        expect(vendor.notes).to eq(attrs[:notes])
      end

      it "redirects to the vendor" do
        vendor = create(:vendor)
        patch vendor_url(vendor), params: { vendor: new_attributes }
        vendor.reload
        expect(response).to redirect_to(vendor_url(vendor))
      end
    end

    context "with invalid parameters" do
      it "redirects back to the edit vendor page" do
        vendor = create(:vendor)
        patch vendor_url(vendor), params: invalid_attributes
        expect(response).to redirect_to(edit_vendor_url(vendor))
      end
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested vendor" do
      vendor = create(:vendor)
      expect {
        delete vendor_url(vendor)
      }.to change(Vendor, :count).by(-1)
    end

    it "redirects to the vendors list" do
      vendor = create(:vendor)
      delete vendor_url(vendor)
      expect(response).to redirect_to(vendors_url)
    end
  end
end
