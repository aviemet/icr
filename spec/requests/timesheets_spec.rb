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

    it "includes non-zero employee_hours when pay period has shifts with hours", :inertia do
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:bi_weekly]
      Setting.payroll_period_day = "monday"
      travel_to Time.zone.local(2024, 3, 15, 12, 0, 0) do
        period_start = Date.new(2024, 3, 11).to_time.beginning_of_day
        period_end = Date.new(2024, 3, 24).to_time.end_of_day
        pay_period = PayPeriod.find_or_create_by!(starts_at: period_start, ends_at: period_end)
        employee = create(:employee)
        timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
        event = create(:calendar_event, starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0), ends_at: Time.zone.local(2024, 3, 15, 17, 0, 0))
        create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)

        get timesheets_url

        expect(response).to be_successful
        expect_inertia.to render_component "Timesheets/Index"
        expect(inertia.props[:employee_hours]).to have_key(employee.id.to_s)
        expect(inertia.props[:employee_hours][employee.id.to_s][:regular_hours]).to eq(8.0)
        expect(inertia.props[:employee_hours][employee.id.to_s][:ot_hours]).to eq(0.0)
      end
    end
  end

  describe "GET /payroll/employees/:employee_id (employee_review)" do
    it "renders a successful response" do
      employee = create(:employee)
      get payroll_employee_review_path(employee_id: employee.id)
      expect(response).to have_http_status(:success)
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
