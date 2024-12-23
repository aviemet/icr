require "rails_helper"

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

RSpec.describe "/dosages" do

  # This should return the minimal set of attributes required to create a valid
  # Dosage. As you add validations to Dosage, be sure to
  # adjust the attributes here as well.
  let(:valid_attributes) {
    skip("Add a hash of attributes valid for your model")
  }

  let(:invalid_attributes) {
    skip("Add a hash of attributes invalid for your model")
  }

  describe "GET /index" do
    it "renders a successful response" do
      Dosage.create! valid_attributes
      get dosages_url
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      dosage = Dosage.create! valid_attributes
      get dosage_url(dosage)
      expect(response).to be_successful
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_dosage_url
      expect(response).to be_successful
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      dosage = Dosage.create! valid_attributes
      get edit_dosage_url(dosage)
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Dosage" do
        expect {
          post dosages_url, params: { dosage: valid_attributes }
        }.to change(Dosage, :count).by(1)
      end

      it "redirects to the created dosage" do
        post dosages_url, params: { dosage: valid_attributes }
        expect(response).to redirect_to(dosage_url(Dosage.last))
      end
    end

    context "with invalid parameters" do
      it "does not create a new Dosage" do
        expect {
          post dosages_url, params: { dosage: invalid_attributes }
        }.not_to change(Dosage, :count)
      end

      it "renders a response with 422 status (i.e. to display the 'new' template)" do
        post dosages_url, params: { dosage: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end

    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      let(:new_attributes) {
        skip("Add a hash of attributes valid for your model")
      }

      it "updates the requested dosage" do
        dosage = Dosage.create! valid_attributes
        patch dosage_url(dosage), params: { dosage: new_attributes }
        dosage.reload
        skip("Add assertions for updated state")
      end

      it "redirects to the dosage" do
        dosage = Dosage.create! valid_attributes
        patch dosage_url(dosage), params: { dosage: new_attributes }
        dosage.reload
        expect(response).to redirect_to(dosage_url(dosage))
      end
    end

    context "with invalid parameters" do

      it "renders a response with 422 status (i.e. to display the 'edit' template)" do
        dosage = Dosage.create! valid_attributes
        patch dosage_url(dosage), params: { dosage: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end

    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested dosage" do
      dosage = Dosage.create! valid_attributes
      expect {
        delete dosage_url(dosage)
      }.to change(Dosage, :count).by(-1)
    end

    it "redirects to the dosages list" do
      dosage = Dosage.create! valid_attributes
      delete dosage_url(dosage)
      expect(response).to redirect_to(dosages_url)
    end
  end
end
