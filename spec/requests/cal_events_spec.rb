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

RSpec.describe "/cal_events", type: :request do
  
  # This should return the minimal set of attributes required to create a valid
  # CalEvent. As you add validations to CalEvent, be sure to
  # adjust the attributes here as well.
  let(:valid_attributes) {
    skip("Add a hash of attributes valid for your model")
  }

  let(:invalid_attributes) {
    skip("Add a hash of attributes invalid for your model")
  }

  describe "GET /index" do
    it "renders a successful response" do
      CalEvent.create! valid_attributes
      get cal_events_url
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      cal_event = CalEvent.create! valid_attributes
      get cal_event_url(cal_event)
      expect(response).to be_successful
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_cal_event_url
      expect(response).to be_successful
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      cal_event = CalEvent.create! valid_attributes
      get edit_cal_event_url(cal_event)
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new CalEvent" do
        expect {
          post cal_events_url, params: { cal_event: valid_attributes }
        }.to change(CalEvent, :count).by(1)
      end

      it "redirects to the created cal_event" do
        post cal_events_url, params: { cal_event: valid_attributes }
        expect(response).to redirect_to(cal_event_url(CalEvent.last))
      end
    end

    context "with invalid parameters" do
      it "does not create a new CalEvent" do
        expect {
          post cal_events_url, params: { cal_event: invalid_attributes }
        }.to change(CalEvent, :count).by(0)
      end

    
      it "renders a response with 422 status (i.e. to display the 'new' template)" do
        post cal_events_url, params: { cal_event: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      let(:new_attributes) {
        skip("Add a hash of attributes valid for your model")
      }

      it "updates the requested cal_event" do
        cal_event = CalEvent.create! valid_attributes
        patch cal_event_url(cal_event), params: { cal_event: new_attributes }
        cal_event.reload
        skip("Add assertions for updated state")
      end

      it "redirects to the cal_event" do
        cal_event = CalEvent.create! valid_attributes
        patch cal_event_url(cal_event), params: { cal_event: new_attributes }
        cal_event.reload
        expect(response).to redirect_to(cal_event_url(cal_event))
      end
    end

    context "with invalid parameters" do
    
      it "renders a response with 422 status (i.e. to display the 'edit' template)" do
        cal_event = CalEvent.create! valid_attributes
        patch cal_event_url(cal_event), params: { cal_event: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested cal_event" do
      cal_event = CalEvent.create! valid_attributes
      expect {
        delete cal_event_url(cal_event)
      }.to change(CalEvent, :count).by(-1)
    end

    it "redirects to the cal_events list" do
      cal_event = CalEvent.create! valid_attributes
      delete cal_event_url(cal_event)
      expect(response).to redirect_to(cal_events_url)
    end
  end
end
