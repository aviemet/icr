# frozen_string_literal: true

require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "pay period clients views", type: :request do
  def create_period_with_client_shift(client:, employee:)
    Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:semi_monthly]
    pay_period = nil
    shift = nil

    travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
      period_start = Date.new(2024, 3, 16).beginning_of_day
      period_end = Date.new(2024, 3, 31).end_of_day
      pay_period = PayPeriod.for_period_dates(period_start.to_date, period_end.to_date)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee, approved_at: nil)
      event = create(
        :calendar_event,
        starts_at: Time.zone.local(2024, 3, 18, 9, 0, 0),
        ends_at: Time.zone.local(2024, 3, 18, 17, 0, 0),
      )
      event.event_participants.create!(participant: client)
      shift = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)
    end

    [pay_period, shift]
  end

  describe "GET /payroll/periods/:id/clients" do
    login_user(:admin)

    it "renders org-wide clients with shift activity and lockstep count keys" do
      client = create(:client)
      other_client = create(:client)
      employee = create(:employee, :employed)
      pay_period, _shift = create_period_with_client_shift(client: client, employee: employee)
      create(:client)

      get clients_period_path(pay_period)

      expect(response).to have_http_status(:success)
      expect_inertia.to render_component "PayPeriods/Clients"
      client_ids = inertia.props[:period_clients].map { |row| row[:id].to_s }
      expect(client_ids).to include(client.id.to_s)
      expect(client_ids).not_to include(other_client.id.to_s)
      expect(inertia.props[:pending_shift_count_by_client].keys.map(&:to_s)).to match_array(client_ids)
      expect(inertia.props[:reviewed_shift_count_by_client].keys.map(&:to_s)).to match_array(client_ids)
      expect(inertia.props[:total_shift_count_by_client].keys.map(&:to_s)).to match_array(client_ids)
    end
  end

  describe "GET /payroll/periods/:id as facilitator" do
    it "redirects facilitators without index to the clients board" do
      job_title = create(:job_title)
      job_title.add_role(:update, Timesheet)
      job_title.add_role(:show, Timesheet)
      facilitator = create(:employee, :employed)
      facilitator.assign_job_title(job_title)
      facilitator.reload
      user = create(:user, person: create(:person, employee: facilitator))
      user.confirm
      client = create(:client)
      create(:clients_manager, manager: facilitator, client: client, starts_at: 1.week.ago)
      employee = create(:employee, :employed)
      pay_period, _shift = create_period_with_client_shift(client: client, employee: employee)

      sign_in user
      get period_path(pay_period)

      expect(response).to redirect_to(clients_period_path(pay_period))
    end
  end

  describe "GET /payroll/periods/:id/clients as facilitator" do
    it "scopes the board to caseload clients" do
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:semi_monthly]

      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        job_title = create(:job_title)
        job_title.add_role(:update, Timesheet)
        job_title.add_role(:show, Timesheet)
        facilitator = create(:employee, :employed)
        facilitator.assign_job_title(job_title)
        facilitator.reload
        user = create(:user, person: create(:person, employee: facilitator))
        user.confirm
        caseload_client = create(:client)
        other_client = create(:client)
        create(:clients_manager, manager: facilitator, client: caseload_client, starts_at: Time.zone.local(2024, 1, 1))
        employee = create(:employee, :employed)
        pay_period = PayPeriod.for_period_dates(Date.new(2024, 3, 16), Date.new(2024, 3, 31))
        timesheet = create(:timesheet, pay_period: pay_period, employee: employee, approved_at: nil)
        event = create(
          :calendar_event,
          starts_at: Time.zone.local(2024, 3, 18, 9, 0, 0),
          ends_at: Time.zone.local(2024, 3, 18, 17, 0, 0),
        )
        event.event_participants.create!(participant: caseload_client)
        create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)

        other_timesheet = create(:timesheet, pay_period: pay_period, employee: create(:employee, :employed), approved_at: nil)
        other_event = create(
          :calendar_event,
          starts_at: Time.zone.local(2024, 3, 19, 9, 0, 0),
          ends_at: Time.zone.local(2024, 3, 19, 17, 0, 0),
        )
        other_event.event_participants.create!(participant: other_client)
        create(:shift, employee: other_timesheet.employee, timesheet: other_timesheet, calendar_event: other_event)

        sign_in user
        get clients_period_path(pay_period)

        expect(response).to have_http_status(:success)
        client_ids = inertia.props[:period_clients].map { |row| row[:id].to_s }
        expect(client_ids).to eq([caseload_client.id.to_s])
        expect(inertia.props[:can_facilitator_approve]).to be(true)
        expect(inertia.props[:can_view_employees]).to be(false)
      end
    end
  end

  describe "GET /payroll/periods/:id/clients/:client_id" do
    login_user(:admin)

    it "renders the client drill-down with employee-selectable shifts for that client" do
      client = create(:client)
      employee = create(:employee, :employed)
      pay_period, shift = create_period_with_client_shift(client: client, employee: employee)

      get client_period_path(pay_period, client.id)

      expect(response).to have_http_status(:success)
      expect_inertia.to render_component "PayPeriods/Client"
      expect(inertia.props[:period_client][:id]).to eq(client.id.to_s)
      expect(inertia.props[:shifts].pluck(:id)).to eq([shift.id.to_s])
      expect(inertia.props[:shifts].first[:shift_id]).to eq(shift.id.to_s)
      expect(inertia.props[:shifts].first[:employee_id]).to eq(employee.id.to_s)
      expect(inertia.props[:shifts].first[:employee_name]).to be_present
      employee_ids = inertia.props[:period_employees].map { |row| row[:id].to_s }
      expect(employee_ids).to eq([employee.id.to_s])
      expect(inertia.props[:period_employees].first[:slug]).to eq(employee.slug)
      expect(inertia.props[:period_employees].map { |row| row[:id].to_s }).to match_array(
        inertia.props[:shifts].map { |row| row[:employee_id].to_s }.uniq,
      )
      expect(inertia.props[:shift_exception_reasons]).to be_a(Hash)
      expect(inertia.props[:shift_ot_hours]).to be_a(Hash)
    end

    it "expands recurring masters into in-period occurrence rows" do
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:semi_monthly]
      client = create(:client)
      employee = create(:employee, :employed)

      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        pay_period = PayPeriod.for_period_dates(Date.new(2024, 3, 16), Date.new(2024, 3, 31))
        timesheet = create(:timesheet, pay_period: pay_period, employee: employee, approved_at: nil)
        event = create(
          :calendar_event,
          starts_at: Time.zone.local(2024, 3, 4, 9, 0, 0),
          ends_at: Time.zone.local(2024, 3, 4, 17, 0, 0),
        )
        event.recurring_patterns.create!(
          recurring_type: :weekly,
          offset: 1,
          day_of_week: 1,
          end_date: Date.new(2024, 3, 31),
        )
        event.event_participants.create!(participant: client)
        shift = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)

        get client_period_path(pay_period, client.id)

        expect(response).to have_http_status(:success)
        starts = inertia.props[:shifts].map { |row| Time.zone.parse(row[:starts_at].to_s).to_date }
        expect(starts).to eq([
          Date.new(2024, 3, 18),
          Date.new(2024, 3, 25),
        ])
        expect(inertia.props[:shifts].pluck(:shift_id).uniq).to eq([shift.id.to_s])
        expect(inertia.props[:shifts].pluck(:is_recurring).uniq).to eq([true])
        expect(inertia.props[:shifts].pluck(:id)).to all(include("#{shift.id}:"))
        expect(inertia.props[:shift_ot_hours].keys).to match_array(inertia.props[:shifts].map { |row| row[:id].to_s })
      end
    end
  end

  describe "GET /payroll/periods/:id (employee combined) holistic props" do
    login_user(:admin)

    it "keeps facilitator progress maps lockstep with employee ids" do
      client = create(:client)
      employee = create(:employee, :employed)
      pay_period, shift = create_period_with_client_shift(client: client, employee: employee)
      shift.update!(facilitator_approved_at: Date.new(2024, 3, 20))

      get period_path(pay_period)

      expect(response).to have_http_status(:success)
      employee_ids = inertia.props[:employees].pluck(:id)
      expect(inertia.props[:facilitator_shift_count_by_employee].keys).to match_array(employee_ids)
      expect(inertia.props[:facilitator_reviewed_shift_count_by_employee].keys).to match_array(employee_ids)
      expect(inertia.props[:timesheet_ids_by_employee].keys).to match_array(employee_ids)
      expect(inertia.props[:employee_hours].keys).to match_array(employee_ids)
      employee_ids.each do |employee_id|
        expect(inertia.props[:employee_hours][employee_id]).to include(
          :regular_hours,
          :ot_hours,
          :ihss_hours,
          :company_hours,
        )
      end
    end
  end

  describe "GET /payroll/periods/:id/clients IHSS utilization" do
    login_user(:admin)

    it "keeps ihss_hours_by_client keys lockstep with period_clients" do
      Setting.ihss_assignment_mode = "shift"
      client = create(:client, ihss_authorized_hours: 40)
      employee = create(:employee, :employed)
      pay_period, shift = create_period_with_client_shift(client: client, employee: employee)
      shift.update!(ihss: true)

      get clients_period_path(pay_period)

      expect(response).to have_http_status(:success)
      client_ids = inertia.props[:period_clients].pluck(:id)
      expect(inertia.props[:ihss_hours_by_client].keys).to match_array(client_ids)
      expect(inertia.props[:ihss_hours_by_client][client.id.to_s]).to eq(8.0)
    end
  end
end
