require "rails_helper"
require_relative "../support/devise"

RSpec.describe "/timesheets", type: :request do
  login_user(:admin)

  def valid_attributes
    employee = create(:employee)
    pay_period = create(:pay_period)
    {
      timesheet: {
        employee_id: employee.id,
        pay_period_id: pay_period.id,
      }
    }
  end

  def invalid_attributes
    {
      timesheet: { pay_period_id: nil, employee_id: nil }
    }
  end

  def new_attributes
    { pay_period_id: create(:pay_period).id, employee_id: create(:employee).id }
  end

  describe "GET /index" do
    it "renders a successful response" do
      create(:timesheet)
      get timesheets_url
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      timesheet = create(:timesheet)
      get timesheet_url(timesheet)
      expect(response).to be_successful
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_timesheet_url
      expect(response).to be_successful
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      timesheet = create(:timesheet)
      get edit_timesheet_url(timesheet)
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Timesheet" do
        expect {
          post timesheets_url, params: valid_attributes
        }.to change(Timesheet, :count).by(1)
      end

      it "redirects to the created timesheet" do
        post timesheets_url, params: valid_attributes
        expect(response).to redirect_to(timesheet_url(Timesheet.last))
      end
    end

    context "with invalid parameters" do
      it "does not create a new Timesheet" do
        expect {
          post timesheets_url, params: invalid_attributes
        }.not_to change(Timesheet, :count)
      end

      it "redirects back to the new timesheet page" do
        post timesheets_url, params: invalid_attributes
        expect(response).to redirect_to(new_timesheet_url)
      end
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      it "updates the requested timesheet" do
        timesheet = create(:timesheet)
        attributes = new_attributes
        patch timesheet_url(timesheet), params: { timesheet: attributes }
        timesheet.reload
        expect(timesheet.pay_period_id).to eq(attributes[:pay_period_id])
      end

      it "redirects to the timesheet" do
        timesheet = create(:timesheet)
        patch timesheet_url(timesheet), params: { timesheet: new_attributes }
        timesheet.reload
        expect(response).to redirect_to(timesheet_url(timesheet))
      end
    end

    context "with invalid parameters" do
      it "redirects back to the edit timesheet page" do
        timesheet = create(:timesheet)
        patch timesheet_url(timesheet), params: invalid_attributes
        expect(response).to redirect_to(edit_timesheet_url(timesheet))
      end
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested timesheet" do
      timesheet = create(:timesheet)
      expect {
        delete timesheet_url(timesheet)
      }.to change(Timesheet, :count).by(-1)
    end

    it "redirects to the timesheets list" do
      timesheet = create(:timesheet)
      delete timesheet_url(timesheet)
      expect(response).to redirect_to(timesheets_url)
    end
  end
end
