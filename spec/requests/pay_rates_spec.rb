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

RSpec.describe "/pay_rates" do

  # This should return the minimal set of attributes required to create a valid
  # PayRate. As you add validations to PayRate, be sure to
  # adjust the attributes here as well.
  let(:valid_attributes) {
    skip("Add a hash of attributes valid for your model")
  }

  let(:invalid_attributes) {
    skip("Add a hash of attributes invalid for your model")
  }

  describe "GET /index" do
    it "renders a successful response" do
      PayRate.create! valid_attributes
      get pay_rates_url
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      pay_rate = PayRate.create! valid_attributes
      get pay_rate_url(pay_rate)
      expect(response).to be_successful
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_pay_rate_url
      expect(response).to be_successful
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      pay_rate = PayRate.create! valid_attributes
      get edit_pay_rate_url(pay_rate)
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new PayRate" do
        expect {
          post pay_rates_url, params: { pay_rate: valid_attributes }
        }.to change(PayRate, :count).by(1)
      end

      it "redirects to the created pay_rate" do
        post pay_rates_url, params: { pay_rate: valid_attributes }
        expect(response).to redirect_to(pay_rate_url(PayRate.last))
      end
    end

    context "with invalid parameters" do
      it "does not create a new PayRate" do
        expect {
          post pay_rates_url, params: { pay_rate: invalid_attributes }
        }.not_to change(PayRate, :count)
      end

      it "renders a response with 422 status (i.e. to display the 'new' template)" do
        post pay_rates_url, params: { pay_rate: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end

    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      let(:new_attributes) {
        skip("Add a hash of attributes valid for your model")
      }

      it "updates the requested pay_rate" do
        pay_rate = PayRate.create! valid_attributes
        patch pay_rate_url(pay_rate), params: { pay_rate: new_attributes }
        pay_rate.reload
        skip("Add assertions for updated state")
      end

      it "redirects to the pay_rate" do
        pay_rate = PayRate.create! valid_attributes
        patch pay_rate_url(pay_rate), params: { pay_rate: new_attributes }
        pay_rate.reload
        expect(response).to redirect_to(pay_rate_url(pay_rate))
      end
    end

    context "with invalid parameters" do

      it "renders a response with 422 status (i.e. to display the 'edit' template)" do
        pay_rate = PayRate.create! valid_attributes
        patch pay_rate_url(pay_rate), params: { pay_rate: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end

    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested pay_rate" do
      pay_rate = PayRate.create! valid_attributes
      expect {
        delete pay_rate_url(pay_rate)
      }.to change(PayRate, :count).by(-1)
    end

    it "redirects to the pay_rates list" do
      pay_rate = PayRate.create! valid_attributes
      delete pay_rate_url(pay_rate)
      expect(response).to redirect_to(pay_rates_url)
    end
  end
end
