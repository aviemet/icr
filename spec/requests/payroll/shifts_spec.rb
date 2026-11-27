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
    shift = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)
    [pay_period, shift, event]
  end

  describe "POST /payroll/shifts/:id/approve" do
    it "creates an occurrence approval for a caseload shift" do
      facilitator, user = setup_facilitator
      client = create(:client)
      employee = create(:employee, :employed)
      _pay_period, shift, event = create_caseload_shift(facilitator: facilitator, client: client, employee: employee)

      sign_in user
      post approve_shift_url(shift), params: { occurrence_starts_at: event.starts_at.iso8601 }

      expect(response).to have_http_status(:redirect)
      expect(shift.occurrence_approvals.reload.count).to eq(1)
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
      post approve_shift_url(shift), params: { occurrence_starts_at: event.starts_at.iso8601 }

      expect(response).to have_http_status(:redirect)
      expect(shift.occurrence_approvals.reload).to be_empty
    end

    it "approves only one occurrence of a recurring series" do
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:weekly]
      Setting.payroll_period_day = "monday"

      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        facilitator, user = setup_facilitator
        client = create(:client)
        employee = create(:employee, :employed)
        create(:clients_manager, manager: facilitator, client: client, starts_at: 1.week.ago)
        pay_period = PayPeriod.for_period_dates(Date.new(2024, 3, 11), Date.new(2024, 3, 17))
        timesheet = create(:timesheet, pay_period: pay_period, employee: employee, approved_at: nil)
        master_starts = Time.zone.local(2024, 3, 11, 9, 0, 0)
        event = create(:calendar_event, starts_at: master_starts, ends_at: master_starts + 8.hours)
        create(
          :calendar_recurring_pattern,
          calendar_event: event,
          recurring_type: :daily,
          offset: 1,
          end_date: nil,
        )
        event.event_participants.create!(participant: client)
        shift = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)
        occurrences = pay_period.shift_occurrences([shift.reload])
        expect(occurrences.size).to be >= 2
        first = occurrences.first
        second = occurrences.second

        sign_in user
        post approve_shift_url(shift), params: {
          pay_period_id: pay_period.id,
          occurrence_starts_at: first.occurrence_starts_at.iso8601,
        }

        expect(response).to have_http_status(:redirect)
        expect(flash[:warning]).to be_blank
        expect(flash[:alert]).to be_blank
        expect(ShiftOccurrenceApproval.where(shift_id: shift.id).count).to eq(1)
        refreshed = pay_period.shift_occurrences([shift.reload])
        expect(refreshed.find { |row| row.occurrence_starts_at.to_i == first.occurrence_starts_at.to_i })
          .to be_facilitator_approved
        expect(refreshed.find { |row| row.occurrence_starts_at.to_i == second.occurrence_starts_at.to_i })
          .not_to be_facilitator_approved
      end
    end
  end

  describe "POST /payroll/shifts/bulk_approve" do
    it "approves pending caseload shifts for a client" do
      facilitator, user = setup_facilitator
      client = create(:client)
      employee = create(:employee, :employed)
      pay_period, shift, event = create_caseload_shift(facilitator: facilitator, client: client, employee: employee)

      sign_in user
      post bulk_approve_shifts_url, params: {
        pay_period_id: pay_period.id,
        client_id: client.id,
        approvals: [
          { shift_id: shift.id, occurrence_starts_at: event.starts_at.iso8601 },
        ],
      }

      expect(response).to have_http_status(:redirect)
      expect(shift.occurrence_approvals.reload.count).to eq(1)
    end
  end

  describe "PATCH /payroll/shifts/:id/ihss" do
    login_user(:admin)

    it "marks one occurrence as IHSS when assignment mode is shift" do
      Setting.ihss_assignment_mode = "shift"
      employee = create(:employee, :employed)
      pay_period = create(:pay_period, finalized_at: nil)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      event = create(
        :calendar_event,
        starts_at: pay_period.starts_at + 1.day,
        ends_at: pay_period.starts_at + 1.day + 8.hours,
      )
      shift = create(
        :shift,
        employee: employee,
        timesheet: timesheet,
        calendar_event: event,
        ihss: false,
      )

      patch ihss_shift_url(shift), params: {
        ihss: true,
        occurrence_starts_at: event.starts_at.iso8601,
        pay_period_id: pay_period.id,
      }, as: :json

      expect(response).to have_http_status(:ok)
      occurrence = pay_period.shift_occurrences([shift.reload]).sole
      body = response.parsed_body
      expect(body["id"]).to eq(occurrence.id.to_s)
      expect(body["ihss"]).to be(true)
      expect(body["shift_ot_hours"]).to be_a(Hash)
      expect(body["employee_hours"]).to be_a(Hash)
      expect(shift.reload.ihss).to be(false)
      expect(occurrence.ihss).to be(true)
    end

    it "marks only one occurrence of a recurring series as IHSS" do
      Setting.ihss_assignment_mode = "shift"
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:weekly]
      Setting.payroll_period_day = "monday"

      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        employee = create(:employee, :employed)
        master_starts = Time.zone.local(2024, 3, 11, 9, 0, 0)
        event = create(
          :calendar_event,
          starts_at: master_starts,
          ends_at: master_starts + 8.hours,
        )
        create(
          :calendar_recurring_pattern,
          calendar_event: event,
          recurring_type: :daily,
          offset: 1,
          end_date: nil,
        )
        pay_period = PayPeriod.for_period_dates(Date.new(2024, 3, 11), Date.new(2024, 3, 17))
        timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
        shift = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event, ihss: false)

        occurrences = pay_period.shift_occurrences([shift.reload])
        expect(occurrences.size).to be >= 2
        first = occurrences.first
        second = occurrences.second

        patch ihss_shift_url(shift), params: {
          ihss: true,
          occurrence_starts_at: first.occurrence_starts_at.iso8601(3),
          pay_period_id: pay_period.id,
        }, as: :json

        expect(response).to have_http_status(:ok)
        body = response.parsed_body
        expect(body["id"]).to eq(first.id.to_s)
        expect(body["ihss"]).to be(true)
        expect(shift.reload.ihss).to be(false)
        by_id = pay_period.shift_occurrences([shift.reload]).index_by { |row| row.id.to_s }
        expect(by_id.fetch(first.id.to_s).ihss).to be(true)
        expect(by_id.fetch(second.id.to_s).ihss).to be(false)
      end
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

      patch ihss_shift_url(shift), params: {
        ihss: true,
        occurrence_starts_at: event.starts_at.iso8601,
      }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(ShiftOccurrenceOverride.where(shift_id: shift.id)).to be_empty
      expect(shift.reload.ihss).to be(false)
    end

    it "allows IHSS updates when the reviewed period is open even if the master timesheet period is finalized" do
      Setting.ihss_assignment_mode = "shift"
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:weekly]
      Setting.payroll_period_day = "monday"
      employee = create(:employee, :employed)
      closed_starts = Time.zone.local(2024, 3, 4).beginning_of_day
      closed_ends = Time.zone.local(2024, 3, 10).end_of_day
      closed_period = PayPeriod.for_period_dates(closed_starts.to_date, closed_ends.to_date)
      closed_period.update!(finalized_at: Time.current)
      closed_timesheet = create(:timesheet, pay_period: closed_period, employee: employee)

      open_starts = Time.zone.local(2024, 3, 11).beginning_of_day
      open_ends = Time.zone.local(2024, 3, 17).end_of_day
      open_period = PayPeriod.for_period_dates(open_starts.to_date, open_ends.to_date)
      create(:timesheet, pay_period: open_period, employee: employee)

      event = create(
        :calendar_event,
        starts_at: Time.zone.local(2024, 3, 5, 9, 0, 0),
        ends_at: Time.zone.local(2024, 3, 5, 17, 0, 0),
      )
      shift = create(:shift, employee: employee, timesheet: closed_timesheet, calendar_event: event, ihss: false)
      shift.update_columns(timesheet_id: closed_timesheet.id) # rubocop:disable Rails/SkipsModelValidations

      patch ihss_shift_url(shift), params: {
        ihss: true,
        occurrence_starts_at: event.starts_at.iso8601,
        pay_period_id: open_period.id,
      }, as: :json

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["ihss"]).to be(true)
      expect(shift.reload.ihss).to be(false)
      expect(
        ShiftOccurrenceOverride.find_by!(
          shift_id: shift.id,
          occurrence_starts_at: ShiftOccurrenceOverride.normalize_occurrence_starts_at(event.starts_at),
        ).ihss,
      ).to be(true)
      occurrence = closed_period.shift_occurrences([shift.reload]).sole
      expect(occurrence.ihss).to be(true)
      expect(response.parsed_body["id"]).to eq(occurrence.id.to_s)
    end
  end

  describe "PATCH /payroll/shifts/:id/service_type" do
    login_user(:admin)

    it "rejects a non-assignable service type" do
      employee = create(:employee, :employed)
      pay_period = create(:pay_period, finalized_at: nil)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      leave_type = create(
        :service_type,
        name: "Sick Leave #{SecureRandom.hex(4)}",
        assignable: false,
        billable: false,
        payable: true,
      )
      event = create(
        :calendar_event,
        starts_at: pay_period.starts_at + 1.day,
        ends_at: pay_period.starts_at + 1.day + 8.hours,
      )
      shift = create(
        :shift,
        employee: employee,
        timesheet: timesheet,
        calendar_event: event,
      )
      original_service_type_id = shift.service_type_id

      patch service_type_shift_url(shift), params: {
        service_type_id: leave_type.id,
        occurrence_starts_at: event.starts_at.iso8601,
        pay_period_id: pay_period.id,
      }

      expect(response).to have_http_status(:redirect)
      alert = flash[:alert]
      alert_message = alert.is_a?(Hash) ? alert[:message] || alert["message"] : alert
      expect(alert_message).to eq(I18n.t("service_types.errors.not_assignable"))
      expect(shift.reload.service_type_id).to eq(original_service_type_id)
      expect(ShiftOccurrenceOverride.where(shift_id: shift.id)).to be_empty
    end

    it "updates one occurrence service type" do
      employee = create(:employee, :employed)
      pay_period = create(:pay_period, finalized_at: nil)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      overnight = ServiceType.find_or_create_by!(name: "Overnight") do |row|
        row.color = "#15803D"
        row.billable = true
        row.payable = true
      end
      event = create(
        :calendar_event,
        starts_at: pay_period.starts_at + 1.day,
        ends_at: pay_period.starts_at + 1.day + 8.hours,
      )
      shift = create(
        :shift,
        employee: employee,
        timesheet: timesheet,
        calendar_event: event,
      )
      regular_id = shift.service_type_id

      patch service_type_shift_url(shift), params: {
        service_type_id: overnight.id,
        occurrence_starts_at: event.starts_at.iso8601,
        pay_period_id: pay_period.id,
      }

      expect(response).to have_http_status(:redirect)
      expect(shift.reload.service_type_id).to eq(regular_id)
      occurrence = pay_period.shift_occurrences([shift.reload]).sole
      expect(occurrence.service_type_id).to eq(overnight.id)
    end

    it "updates only one occurrence of a recurring series" do
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:weekly]
      Setting.payroll_period_day = "monday"

      travel_to Time.zone.local(2024, 3, 20, 12, 0, 0) do
        employee = create(:employee, :employed)
        overnight = ServiceType.find_or_create_by!(name: "Overnight") do |row|
          row.color = "#15803D"
          row.billable = true
          row.payable = true
        end
        master_starts = Time.zone.local(2024, 3, 11, 9, 0, 0)
        event = create(
          :calendar_event,
          starts_at: master_starts,
          ends_at: master_starts + 8.hours,
        )
        create(
          :calendar_recurring_pattern,
          calendar_event: event,
          recurring_type: :daily,
          offset: 1,
          end_date: nil,
        )
        pay_period = PayPeriod.for_period_dates(Date.new(2024, 3, 11), Date.new(2024, 3, 17))
        timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
        shift = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)
        master_service_type_id = shift.service_type_id

        occurrences = pay_period.shift_occurrences([shift.reload])
        first = occurrences.first
        second = occurrences.second

        patch service_type_shift_url(shift), params: {
          service_type_id: overnight.id,
          occurrence_starts_at: first.occurrence_starts_at.iso8601(3),
          pay_period_id: pay_period.id,
        }

        expect(response).to have_http_status(:redirect)
        expect(shift.reload.service_type_id).to eq(master_service_type_id)
        refreshed = pay_period.shift_occurrences([shift.reload])
        expect(refreshed.find { |row| row.occurrence_starts_at.to_i == first.occurrence_starts_at.to_i }.service_type_id)
          .to eq(overnight.id)
        expect(refreshed.find { |row| row.occurrence_starts_at.to_i == second.occurrence_starts_at.to_i }.service_type_id)
          .to eq(master_service_type_id)
      end
    end

    it "rejects service type updates on a finalized period" do
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:weekly]
      Setting.payroll_period_day = "monday"
      employee = create(:employee, :employed)
      starts_at = Time.zone.local(2024, 3, 11).beginning_of_day
      ends_at = Time.zone.local(2024, 3, 17).end_of_day
      pay_period = PayPeriod.for_period_dates(starts_at.to_date, ends_at.to_date)
      pay_period.update!(finalized_at: Time.current)
      timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
      overnight = ServiceType.find_or_create_by!(name: "Overnight") do |row|
        row.color = "#15803D"
        row.billable = true
        row.payable = true
      end
      event = create(
        :calendar_event,
        starts_at: Time.zone.local(2024, 3, 12, 9, 0, 0),
        ends_at: Time.zone.local(2024, 3, 12, 17, 0, 0),
      )
      shift = create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)
      shift.update_columns(timesheet_id: timesheet.id) # rubocop:disable Rails/SkipsModelValidations
      original_service_type_id = shift.service_type_id

      patch service_type_shift_url(shift), params: {
        service_type_id: overnight.id,
        occurrence_starts_at: event.starts_at.iso8601,
      }

      expect(response).to have_http_status(:redirect)
      expect(ShiftOccurrenceOverride.where(shift_id: shift.id)).to be_empty
      expect(shift.reload.service_type_id).to eq(original_service_type_id)
    end

    it "allows service type updates when the reviewed period is open even if the master timesheet period is finalized" do
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:weekly]
      Setting.payroll_period_day = "monday"
      employee = create(:employee, :employed)
      closed_starts = Time.zone.local(2024, 3, 4).beginning_of_day
      closed_ends = Time.zone.local(2024, 3, 10).end_of_day
      closed_period = PayPeriod.for_period_dates(closed_starts.to_date, closed_ends.to_date)
      closed_period.update!(finalized_at: Time.current)
      closed_timesheet = create(:timesheet, pay_period: closed_period, employee: employee)

      open_starts = Time.zone.local(2024, 3, 11).beginning_of_day
      open_ends = Time.zone.local(2024, 3, 17).end_of_day
      open_period = PayPeriod.for_period_dates(open_starts.to_date, open_ends.to_date)
      create(:timesheet, pay_period: open_period, employee: employee)

      overnight = ServiceType.find_or_create_by!(name: "Overnight") do |row|
        row.color = "#15803D"
        row.billable = true
        row.payable = true
      end
      event = create(
        :calendar_event,
        starts_at: Time.zone.local(2024, 3, 5, 9, 0, 0),
        ends_at: Time.zone.local(2024, 3, 5, 17, 0, 0),
      )
      shift = create(:shift, employee: employee, timesheet: closed_timesheet, calendar_event: event)
      shift.update_columns(timesheet_id: closed_timesheet.id) # rubocop:disable Rails/SkipsModelValidations
      original_service_type_id = shift.service_type_id

      patch service_type_shift_url(shift), params: {
        service_type_id: overnight.id,
        occurrence_starts_at: event.starts_at.iso8601,
        pay_period_id: open_period.id,
      }

      expect(response).to have_http_status(:redirect)
      expect(shift.reload.service_type_id).to eq(original_service_type_id)
      expect(
        ShiftOccurrenceOverride.find_by!(
          shift_id: shift.id,
          occurrence_starts_at: ShiftOccurrenceOverride.normalize_occurrence_starts_at(event.starts_at),
        ).service_type_id,
      ).to eq(overnight.id)
      occurrence = closed_period.shift_occurrences([shift.reload]).sole
      expect(occurrence.service_type_id).to eq(overnight.id)
    end
  end
end
