# frozen_string_literal: true

require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "/payroll/shifts", type: :request do
  def setup_facilitator
    job_title = create(:job_title)
    job_title.add_role(:update, Timesheet)
    job_title.add_role(:show, Timesheet)
    facilitator = create(:employee, :employed)
    facilitator.assign_job_title(job_title)
    facilitator.reload
    user = create(:user, person: create(:person, employee: facilitator))
    user.confirm
    [facilitator, user]
  end

  def create_caseload_shift(facilitator:, client:, employee:)
    create(:clients_manager, manager: facilitator, client: client, starts_at: 1.week.ago)
    pay_period = create(
      :pay_period,
      starts_at: 10.days.ago.beginning_of_day,
      ends_at: 1.day.from_now.end_of_day,
      finalized_at: nil,
      approved_at: nil,
    )
    timesheet = create(:timesheet, pay_period: pay_period, employee: employee, approved_at: nil)
    event = create(
      :calendar_event,
      starts_at: 2.days.ago.change(hour: 9),
      ends_at: 2.days.ago.change(hour: 17),
    )
    event.event_participants.create!(participant: client)
    shift = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event, facilitator_approved_at: nil)
    [pay_period, shift]
  end

  describe "POST /payroll/shifts/:id/approve" do
    it "sets facilitator_approved_at for a caseload shift" do
      facilitator, user = setup_facilitator
      client = create(:client)
      employee = create(:employee, :employed)
      _pay_period, shift = create_caseload_shift(facilitator: facilitator, client: client, employee: employee)

      sign_in user
      post approve_shift_url(shift)

      expect(response).to have_http_status(:redirect)
      expect(shift.reload.facilitator_approved_at).to be_present
    end

    it "rejects approve for a client outside the caseload" do
      facilitator, user = setup_facilitator
      client = create(:client)
      other_client = create(:client)
      employee = create(:employee, :employed)
      create(:clients_manager, manager: facilitator, client: client, starts_at: 1.week.ago)
      pay_period = create(:pay_period, finalized_at: nil, approved_at: nil)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee, approved_at: nil)
      event = create(
        :calendar_event,
        starts_at: pay_period.starts_at + 1.day,
        ends_at: pay_period.starts_at + 1.day + 8.hours,
      )
      event.event_participants.create!(participant: other_client)
      shift = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)

      sign_in user
      post approve_shift_url(shift)

      expect(response).to have_http_status(:redirect)
      expect(shift.reload.facilitator_approved_at).to be_nil
    end
  end

  describe "POST /payroll/shifts/bulk_approve" do
    it "approves pending caseload shifts for a client" do
      facilitator, user = setup_facilitator
      client = create(:client)
      employee = create(:employee, :employed)
      pay_period, shift = create_caseload_shift(facilitator: facilitator, client: client, employee: employee)

      sign_in user
      post bulk_approve_shifts_url, params: {
        pay_period_id: pay_period.id,
        client_id: client.id,
        shift_ids: [shift.id],
      }

      expect(response).to have_http_status(:redirect)
      expect(shift.reload.facilitator_approved_at).to be_present
    end
  end

  describe "PATCH /payroll/shifts/:id/ihss" do
    login_user(:admin)

    it "marks a shift as IHSS when assignment mode is shift" do
      Setting.ihss_assignment_mode = "shift"
      employee = create(:employee, :employed)
      pay_period = create(:pay_period, finalized_at: nil)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      shift = create(
        :shift,
        employee: employee,
        timesheet: timesheet,
        calendar_event: create(
          :calendar_event,
          starts_at: pay_period.starts_at + 1.day,
          ends_at: pay_period.starts_at + 1.day + 8.hours,
        ),
        ihss: false,
      )

      patch ihss_shift_url(shift), params: { ihss: true }

      expect(response).to have_http_status(:redirect)
      expect(shift.reload.ihss).to be(true)
    end

    it "rejects IHSS updates on a finalized period" do
      Setting.ihss_assignment_mode = "shift"
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:weekly]
      Setting.payroll_period_day = "monday"
      employee = create(:employee, :employed)
      starts_at = Time.zone.local(2024, 3, 11).beginning_of_day
      ends_at = Time.zone.local(2024, 3, 17).end_of_day
      pay_period = PayPeriod.for_period_dates(starts_at.to_date, ends_at.to_date)
      pay_period.update!(finalized_at: Time.current)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      event = create(
        :calendar_event,
        starts_at: Time.zone.local(2024, 3, 12, 9, 0, 0),
        ends_at: Time.zone.local(2024, 3, 12, 17, 0, 0),
      )
      shift = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event, ihss: false)
      shift.update_columns(timesheet_id: timesheet.id) # rubocop:disable Rails/SkipsModelValidations

      patch ihss_shift_url(shift), params: { ihss: true }

      expect(response).to have_http_status(:redirect)
      expect(shift.reload.ihss).to be(false)
    end
  end
end


