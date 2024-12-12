require 'rails_helper'

RSpec.describe "/calendar_event_exceptions" do
  let(:valid_attributes) {
    skip("Add a hash of attributes valid for your model")
  }

  let(:invalid_attributes) {
    skip("Add a hash of attributes invalid for your model")
  }

  describe "GET /index" do
    it "renders a successful response" do
      CalendarEventException.create! valid_attributes
      get calendar_event_exceptions_url
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      calendar_event_exception = CalendarEventException.create! valid_attributes
      get calendar_event_exception_url(calendar_event_exception)
      expect(response).to be_successful
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_calendar_event_exception_url
      expect(response).to be_successful
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      calendar_event_exception = CalendarEventException.create! valid_attributes
      get edit_calendar_event_exception_url(calendar_event_exception)
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new CalendarEventException" do
        expect {
          post calendar_event_exceptions_url, params: { calendar_event_exception: valid_attributes }
        }.to change(CalendarEventException, :count).by(1)
      end

      it "redirects to the created calendar_event_exception" do
        post calendar_event_exceptions_url, params: { calendar_event_exception: valid_attributes }
        expect(response).to redirect_to(calendar_event_exception_url(CalendarEventException.last))
      end
    end

    context "with invalid parameters" do
      it "does not create a new CalendarEventException" do
        expect {
          post calendar_event_exceptions_url, params: { calendar_event_exception: invalid_attributes }
        }.not_to change(CalendarEventException, :count)
      end

      it "renders a response with 422 status (i.e. to display the 'new' template)" do
        post calendar_event_exceptions_url, params: { calendar_event_exception: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end

    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      let(:new_attributes) {
        skip("Add a hash of attributes valid for your model")
      }

      it "updates the requested calendar_event_exception" do
        calendar_event_exception = CalendarEventException.create! valid_attributes
        patch calendar_event_exception_url(calendar_event_exception), params: { calendar_event_exception: new_attributes }
        calendar_event_exception.reload
        skip("Add assertions for updated state")
      end

      it "redirects to the calendar_event_exception" do
        calendar_event_exception = CalendarEventException.create! valid_attributes
        patch calendar_event_exception_url(calendar_event_exception), params: { calendar_event_exception: new_attributes }
        calendar_event_exception.reload
        expect(response).to redirect_to(calendar_event_exception_url(calendar_event_exception))
      end
    end

    context "with invalid parameters" do

      it "renders a response with 422 status (i.e. to display the 'edit' template)" do
        calendar_event_exception = CalendarEventException.create! valid_attributes
        patch calendar_event_exception_url(calendar_event_exception), params: { calendar_event_exception: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end

    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested calendar_event_exception" do
      calendar_event_exception = CalendarEventException.create! valid_attributes
      expect {
        delete calendar_event_exception_url(calendar_event_exception)
      }.to change(CalendarEventException, :count).by(-1)
    end

    it "redirects to the calendar_event_exceptions list" do
      calendar_event_exception = CalendarEventException.create! valid_attributes
      delete calendar_event_exception_url(calendar_event_exception)
      expect(response).to redirect_to(calendar_event_exceptions_url)
    end
  end
end
