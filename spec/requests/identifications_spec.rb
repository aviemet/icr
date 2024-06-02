require 'rails_helper'

# This spec was generated by rspec-rails when you ran the scaffold generator.
# It demonstrates how one might use RSpec to test the controller code that
# was generated by Rails when you ran the scaffold generator.
#
# It assumes that the implementation code is generated by the rails scaffold
# generator. If you are using any extension libraries to generate different
# controller code, this generated spec may or may not pass.
#
# It only uses APIs available in rails and/or rspec-rails. There are a number
# of tools you can use to make these specs even more expressive, but we're
# sticking to rails and rspec-rails APIs to keep things simple and stable.

RSpec.describe "/identifications", type: :request do
  
  # This should return the minimal set of attributes required to create a valid
  # Identification. As you add validations to Identification, be sure to
  # adjust the attributes here as well.
  let(:valid_attributes) {
    skip("Add a hash of attributes valid for your model")
  }

  let(:invalid_attributes) {
    skip("Add a hash of attributes invalid for your model")
  }

  describe "GET /index" do
    it "renders a successful response" do
      Identification.create! valid_attributes
      get identifications_url
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      identification = Identification.create! valid_attributes
      get identification_url(identification)
      expect(response).to be_successful
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_identification_url
      expect(response).to be_successful
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      identification = Identification.create! valid_attributes
      get edit_identification_url(identification)
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Identification" do
        expect {
          post identifications_url, params: { identification: valid_attributes }
        }.to change(Identification, :count).by(1)
      end

      it "redirects to the created identification" do
        post identifications_url, params: { identification: valid_attributes }
        expect(response).to redirect_to(identification_url(Identification.last))
      end
    end

    context "with invalid parameters" do
      it "does not create a new Identification" do
        expect {
          post identifications_url, params: { identification: invalid_attributes }
        }.to change(Identification, :count).by(0)
      end

    
      it "renders a response with 422 status (i.e. to display the 'new' template)" do
        post identifications_url, params: { identification: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      let(:new_attributes) {
        skip("Add a hash of attributes valid for your model")
      }

      it "updates the requested identification" do
        identification = Identification.create! valid_attributes
        patch identification_url(identification), params: { identification: new_attributes }
        identification.reload
        skip("Add assertions for updated state")
      end

      it "redirects to the identification" do
        identification = Identification.create! valid_attributes
        patch identification_url(identification), params: { identification: new_attributes }
        identification.reload
        expect(response).to redirect_to(identification_url(identification))
      end
    end

    context "with invalid parameters" do
    
      it "renders a response with 422 status (i.e. to display the 'edit' template)" do
        identification = Identification.create! valid_attributes
        patch identification_url(identification), params: { identification: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested identification" do
      identification = Identification.create! valid_attributes
      expect {
        delete identification_url(identification)
      }.to change(Identification, :count).by(-1)
    end

    it "redirects to the identifications list" do
      identification = Identification.create! valid_attributes
      delete identification_url(identification)
      expect(response).to redirect_to(identifications_url)
    end
  end
end
