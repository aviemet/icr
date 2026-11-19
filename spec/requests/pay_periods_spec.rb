require "rails_helper"
require_relative "../support/devise"

RSpec.describe "/payroll", type: :request do
  login_user(:admin)

  describe "GET /payroll (index)" do
    it "renders the payroll home with current summary and pay periods" do
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:semi_monthly]

      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        period_start = Date.new(2024, 3, 16).to_time.beginning_of_day
        period_end = Date.new(2024, 3, 31).to_time.end_of_day
        pay_period = PayPeriod.find_or_create_by!(starts_at: period_start, ends_at: period_end)
        create(:employee)

        get payroll_periods_url

        expect(response).to be_successful
        expect_inertia.to render_component "PayPeriods/Index"
        expect(inertia.props[:current_period][:id]).to eq(pay_period.id)
        expect(inertia.props[:current_period][:starts_at]).to start_with("2024-03-16")
        expect(inertia.props[:current_period][:ends_at]).to start_with("2024-03-31")
        expect(inertia.props[:current_summary][:pay_period_id]).to eq(pay_period.id.to_s)
        expect(inertia.props).not_to have_key(:employees)
        expect(inertia.props[:periods]).to be_an(Array)
        expect(inertia.props[:periods].first[:id]).to eq(pay_period.id.to_s)
      end
    end

    it "lists future periods created when shifts are scheduled into them" do
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:semi_monthly]

      travel_to Time.zone.local(2024, 3, 10, 12, 0, 0) do
        current = PayPeriod.for_period_dates(Date.new(2024, 3, 1), Date.new(2024, 3, 15))
        employee = create(:employee)
        create(
          :shift,
          employee: employee,
          calendar_event: create(
            :calendar_event,
            starts_at: Time.zone.local(2024, 3, 20, 9, 0, 0),
            ends_at: Time.zone.local(2024, 3, 20, 17, 0, 0),
          ),
        )

        get payroll_periods_url

        expect(response).to be_successful
        expect(inertia.props[:current_period][:id]).to eq(current.id)
        future_period = PayPeriod.find_by!(starts_at: Date.new(2024, 3, 16).beginning_of_day)
        expect(inertia.props[:periods].pluck(:id)).to include(future_period.id.to_s)
        expect(future_period.ends_at.to_date).to eq(Date.new(2024, 3, 31))
      end
    end
  end

  describe "GET /payroll/periods/:id (show)" do
    it "renders the period employee list with summary" do
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:bi_weekly]
      Setting.payroll_period_day = "monday"

      travel_to Time.zone.local(2024, 3, 15, 12, 0, 0) do
        period_start = Date.new(2024, 3, 11).to_time.beginning_of_day
        period_end = Date.new(2024, 3, 24).to_time.end_of_day
        pay_period = PayPeriod.find_or_create_by!(starts_at: period_start, ends_at: period_end)
        approved_employee = create(:employee)
        pending_employee = create(:employee)
        create(:timesheet, pay_period: pay_period, employee: approved_employee, approved_at: Date.new(2024, 3, 20))
        create(:timesheet, pay_period: pay_period, employee: pending_employee, approved_at: nil)
        approved_event = create(
          :calendar_event,
          starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0),
          ends_at: Time.zone.local(2024, 3, 15, 17, 0, 0),
        )
        pending_event = create(
          :calendar_event,
          starts_at: Time.zone.local(2024, 3, 16, 9, 0, 0),
          ends_at: Time.zone.local(2024, 3, 16, 17, 0, 0),
        )
        create(
          :shift,
          employee: approved_employee,
          timesheet: Timesheet.find_by(employee: approved_employee),
          calendar_event: approved_event,
        )
        create(
          :shift,
          employee: pending_employee,
          timesheet: Timesheet.find_by(employee: pending_employee),
          calendar_event: pending_event,
        )

        get period_url(pay_period)

        expect(response).to be_successful
        expect_inertia.to render_component "PayPeriods/Show"
        expect(inertia.props[:can_approve]).to be(true)
        expect(inertia.props[:can_finalize]).to be(false)
        expect(inertia.props[:finalize_blocked_reason]).to eq("before_period_end")
        expect(inertia.props[:approved_at_by_employee]).to have_key(approved_employee.id.to_s)
        expect(inertia.props[:summary]).to include(
          approved_count: 1,
          pending_count: 1,
          flagged_count: 0,
        )
        expect(inertia.props[:employee_hours][approved_employee.id.to_s][:regular_hours]).to eq(8.0)
        expect(inertia.props[:employee_hours][pending_employee.id.to_s][:regular_hours]).to eq(8.0)
        expect(inertia.props[:employees].pluck(:id)).to contain_exactly(
          approved_employee.id.to_s,
          pending_employee.id.to_s,
        )
      end
    end

    it "keeps can_approve true after the due date while the period is open" do
      Setting.payroll_due_date_rule_type = Setting::PAYROLL_DUE_DATE_RULE_TYPES[:days_after_period_end]
      Setting.payroll_due_date_days = 5
      pay_period = create(
        :pay_period,
        starts_at: Time.zone.local(2024, 3, 1).beginning_of_day,
        ends_at: Time.zone.local(2024, 3, 15).end_of_day,
        finalized_at: nil,
        approved_at: nil,
      )
      employee = create(:employee)
      create(:timesheet, pay_period: pay_period, employee: employee, approved_at: nil)
      create(
        :shift,
        employee: employee,
        timesheet: Timesheet.find_by(employee: employee, pay_period: pay_period),
        calendar_event: create(
          :calendar_event,
          starts_at: Time.zone.local(2024, 3, 10, 9, 0, 0),
          ends_at: Time.zone.local(2024, 3, 10, 17, 0, 0),
        ),
      )

      travel_to Time.zone.local(2024, 3, 25, 12, 0, 0) do
        get period_url(pay_period)

        expect(response).to be_successful
        expect(inertia.props[:approval_window_open]).to be(false)
        expect(inertia.props[:can_approve]).to be(true)
        expect(inertia.props[:finalized]).to be(false)
      end
    end

    it "omits employees with no worked shifts for the period" do
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:bi_weekly]
      Setting.payroll_period_day = "monday"

      travel_to Time.zone.local(2024, 3, 15, 12, 0, 0) do
        period_start = Date.new(2024, 3, 11).to_time.beginning_of_day
        period_end = Date.new(2024, 3, 24).to_time.end_of_day
        pay_period = PayPeriod.find_or_create_by!(starts_at: period_start, ends_at: period_end)
        working_employee = create(:employee)
        create(:employee)
        create(:timesheet, pay_period: pay_period, employee: working_employee, approved_at: nil)
        create(:timesheet, pay_period: pay_period, employee: create(:employee), approved_at: nil)
        event = create(
          :calendar_event,
          starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0),
          ends_at: Time.zone.local(2024, 3, 15, 17, 0, 0),
        )
        create(
          :shift,
          employee: working_employee,
          timesheet: Timesheet.find_by(employee: working_employee),
          calendar_event: event,
        )

        get period_url(pay_period)

        expect(response).to be_successful
        expect(inertia.props[:employees].pluck(:id)).to eq([working_employee.id.to_s])
        expect(inertia.props[:summary]).to include(
          approved_count: 0,
          pending_count: 1,
          total_count: 1,
        )
      end
    end
  end

  describe "POST /payroll/periods/:id/finalize" do
    it "finalizes a closed period after the period end" do
      pay_period = create(
        :pay_period,
        starts_at: 20.days.ago.beginning_of_day,
        ends_at: 6.days.ago.end_of_day,
        finalized_at: nil,
        approved_at: nil,
      )
      employee = create(:employee)
      create(:timesheet, pay_period: pay_period, employee: employee, approved_at: Date.current)

      post finalize_period_url(pay_period)

      expect(response).to redirect_to(period_url(pay_period))
      expect(pay_period.reload).to be_finalized
      expect(pay_period.config_snapshot).to include("finalized_summary")
    end

    it "rejects finalize while the period is still open" do
      pay_period = create(
        :pay_period,
        starts_at: Date.current.beginning_of_day,
        ends_at: 5.days.from_now.end_of_day,
        finalized_at: nil,
        approved_at: nil,
      )

      post finalize_period_url(pay_period)

      expect(response).to redirect_to(period_url(pay_period))
      expect(pay_period.reload).not_to be_finalized
    end
  end

  describe "POST /payroll/periods/:id/adjustments" do
    it "records an adjustment on a finalized period" do
      pay_period = create(
        :pay_period,
        starts_at: 30.days.ago.beginning_of_day,
        ends_at: 16.days.ago.end_of_day,
        finalized_at: 1.day.ago,
        approved_at: nil,
      )
      employee = create(:employee)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee, approved_at: Date.current)

      expect {
        post adjustments_period_url(pay_period), params: {
          reason: "Correct approval date",
          timesheet_id: timesheet.id,
          change_set: { approved_at: nil },
        }
      }.to change(Payroll::Adjustment, :count).by(1)

      expect(response).to redirect_to(period_url(pay_period))
      expect(timesheet.reload.approved_at).to be_nil
    end
  end

  describe "GET /payroll/periods/:id/export" do
    it "downloads approved hours CSV and records an export version" do
      pay_period = create(
        :pay_period,
        starts_at: 20.days.ago.beginning_of_day,
        ends_at: 6.days.ago.end_of_day,
        finalized_at: 1.day.ago,
        approved_at: nil,
      )
      employee = create(:employee, number: "E-42")
      create(:timesheet, pay_period: pay_period, employee: employee, approved_at: Date.current)

      expect {
        get export_period_url(pay_period)
      }.to change { pay_period.versions.where(event: "export").count }.by(1)

      expect(response).to be_successful
      expect(response.media_type).to eq("text/csv")
      expect(response.body).to include("employee_number")
      expect(response.body).to include("E-42")
      expect(pay_period.versions.where(event: "export").last.whodunnit).to eq(@user.id.to_s)
    end

    it "rejects export before the period is locked" do
      pay_period = create(
        :pay_period,
        starts_at: 20.days.ago.beginning_of_day,
        ends_at: 6.days.ago.end_of_day,
        finalized_at: nil,
        approved_at: nil,
      )

      expect {
        get export_period_url(pay_period)
      }.not_to(change { pay_period.versions.where(event: "export").count })

      expect(response).to redirect_to(period_url(pay_period))
    end
  end
end
