require "rails_helper"
require_relative "../support/devise"

RSpec.describe "/timesheets", type: :request do
  login_user(:admin)

  def valid_attributes
    employee = create(:employee)
    pay_period = create(:pay_period, finalized_at: nil, approved_at: nil)
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
    { pay_period_id: create(:pay_period, finalized_at: nil, approved_at: nil).id, employee_id: create(:employee).id }
  end

  describe "GET /payroll/periods/:period_id/employees/:employee_id (employee_review)" do
    it "renders a successful response with approve controls enabled", :inertia do
      pay_period = create(:pay_period, finalized_at: nil, approved_at: nil)
      employee = create(:employee)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee, approved_at: nil)

      get period_employee_review_path(period_id: pay_period.id, employee_id: employee.id)

      expect(response).to have_http_status(:success)
      expect_inertia.to render_component "Timesheets/EmployeeReview"
      expect(inertia.props[:can_approve]).to be(true)
      expect(inertia.props[:finalized]).to be(false)
      expect(inertia.props[:timesheet][:id]).to eq(timesheet.id.to_s)
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
        timesheet = create(:timesheet, pay_period: create(:pay_period, finalized_at: nil, approved_at: nil))
        attributes = new_attributes
        patch timesheet_url(timesheet), params: { timesheet: attributes }
        timesheet.reload
        expect(timesheet.pay_period_id).to eq(attributes[:pay_period_id])
      end

      it "redirects to the timesheet" do
        timesheet = create(:timesheet, pay_period: create(:pay_period, finalized_at: nil, approved_at: nil))
        patch timesheet_url(timesheet), params: { timesheet: new_attributes }
        timesheet.reload
        expect(response).to redirect_to(timesheet_url(timesheet))
      end
    end

    context "with invalid parameters" do
      it "redirects back to the edit timesheet page" do
        timesheet = create(:timesheet, pay_period: create(:pay_period, finalized_at: nil, approved_at: nil))
        patch timesheet_url(timesheet), params: invalid_attributes
        expect(response).to redirect_to(edit_timesheet_url(timesheet))
      end
    end

    it "rejects updates when the pay period is finalized" do
      pay_period = create(:pay_period, finalized_at: Time.current, approved_at: nil)
      timesheet = create(:timesheet, pay_period: pay_period)
      other_period = create(:pay_period, finalized_at: nil, approved_at: nil)

      patch timesheet_url(timesheet), params: { timesheet: { pay_period_id: other_period.id } }

      expect(response).to redirect_to(timesheet_url(timesheet))
      expect(timesheet.reload.pay_period_id).to eq(pay_period.id)
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested timesheet" do
      timesheet = create(:timesheet, pay_period: create(:pay_period, finalized_at: nil, approved_at: nil))
      expect {
        delete timesheet_url(timesheet)
      }.to change(Timesheet, :count).by(-1)
    end

    it "redirects to the payroll periods list" do
      timesheet = create(:timesheet, pay_period: create(:pay_period, finalized_at: nil, approved_at: nil))
      delete timesheet_url(timesheet)
      expect(response).to redirect_to(payroll_periods_url)
    end
  end

  describe "POST /approve" do
    it "approves a timesheet when the period is not finalized" do
      pay_period = create(
        :pay_period,
        starts_at: 40.days.ago.beginning_of_day,
        ends_at: 20.days.ago.end_of_day,
        finalized_at: nil,
        approved_at: nil,
      )
      timesheet = create(:timesheet, pay_period: pay_period, approved_at: nil)

      post approve_timesheet_url(timesheet)

      expect(response).to redirect_to(period_url(pay_period))
      expect(timesheet.reload.approved_at).to be_present
    end

    it "rejects approve when the pay period is finalized" do
      pay_period = create(
        :pay_period,
        starts_at: 20.days.ago.beginning_of_day,
        ends_at: 6.days.ago.end_of_day,
        finalized_at: 1.day.ago,
        approved_at: nil,
      )
      timesheet = create(:timesheet, pay_period: pay_period, approved_at: nil)

      post approve_timesheet_url(timesheet)

      expect(response).to redirect_to(period_url(pay_period))
      expect(timesheet.reload.approved_at).to be_nil
    end
  end

  describe "POST /unapprove" do
    it "clears approval when the period is not finalized" do
      pay_period = create(
        :pay_period,
        starts_at: 40.days.ago.beginning_of_day,
        ends_at: 20.days.ago.end_of_day,
        finalized_at: nil,
        approved_at: nil,
      )
      timesheet = create(:timesheet, pay_period: pay_period, approved_at: Date.current)

      post unapprove_timesheet_url(timesheet)

      expect(response).to redirect_to(period_url(pay_period))
      expect(timesheet.reload.approved_at).to be_nil
    end

    it "rejects unapprove when the pay period is finalized" do
      pay_period = create(
        :pay_period,
        starts_at: 20.days.ago.beginning_of_day,
        ends_at: 6.days.ago.end_of_day,
        finalized_at: 1.day.ago,
        approved_at: nil,
      )
      timesheet = create(:timesheet, pay_period: pay_period, approved_at: Date.current)

      post unapprove_timesheet_url(timesheet)

      expect(response).to redirect_to(period_url(pay_period))
      expect(timesheet.reload.approved_at).to be_present
    end
  end

  describe "POST /bulk_approve" do
    it "approves pending timesheets after the due date when the period is open" do
      pay_period = create(
        :pay_period,
        starts_at: 40.days.ago.beginning_of_day,
        ends_at: 20.days.ago.end_of_day,
        finalized_at: nil,
        approved_at: nil,
      )
      pending_timesheet = create(:timesheet, pay_period: pay_period, approved_at: nil)
      create(:timesheet, pay_period: pay_period, approved_at: Date.current)

      post bulk_approve_timesheets_url, params: {
        pay_period_id: pay_period.id,
        approve_all: true,
      }

      expect(response).to redirect_to(period_url(pay_period))
      expect(pending_timesheet.reload.approved_at).to be_present
    end
  end
end
