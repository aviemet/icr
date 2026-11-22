# frozen_string_literal: true

require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "PayPeriods IHSS assignments", type: :request do
  login_user(:admin)

  def period_with_pair
    employee = create(:employee, :employed)
    client = create(:client, ihss_authorized_hours: 40)
    pay_period = create(
      :pay_period,
      starts_at: Time.zone.local(2024, 3, 11).beginning_of_day,
      ends_at: Time.zone.local(2024, 3, 24).end_of_day,
      finalized_at: nil,
    )
    timesheet = create(:timesheet, pay_period: pay_period, employee: employee)
    event = create(
      :calendar_event,
      starts_at: Time.zone.local(2024, 3, 12, 9, 0, 0),
      ends_at: Time.zone.local(2024, 3, 12, 17, 0, 0),
    )
    event.event_participants.create!(participant: client)
    create(:shift, employee: employee, timesheet: timesheet, calendar_event: event)
    [pay_period, employee, client]
  end

  describe "GET /payroll/periods/:id/ihss" do
    it "renders the assignment board when mode is period" do
      Setting.ihss_assignment_mode = "period"
      pay_period, employee, client = period_with_pair

      get ihss_period_path(pay_period)

      expect(response).to be_successful
      expect_inertia.to render_component "PayPeriods/Ihss"
      row = inertia.props[:assignment_rows].first
      expect(row[:employee_id]).to eq(employee.id.to_s)
      expect(row[:client_id]).to eq(client.id.to_s)
    end

    it "redirects when mode is shift" do
      Setting.ihss_assignment_mode = "shift"
      pay_period, = period_with_pair

      get ihss_period_path(pay_period)

      expect(response).to redirect_to(period_path(pay_period))
    end
  end

  describe "PATCH /payroll/periods/:id/ihss" do
    it "saves period assignments" do
      Setting.ihss_assignment_mode = "period"
      pay_period, employee, client = period_with_pair

      patch ihss_period_path(pay_period), params: {
        assignments: [
          { employee_id: employee.id, client_id: client.id, hours: 12.5 },
        ],
      }

      expect(response).to redirect_to(ihss_period_path(pay_period))
      assignment = Payroll::IhssPeriodAssignment.find_by!(
        pay_period: pay_period,
        employee: employee,
        client: client,
      )
      expect(assignment.hours).to eq(12.5)
    end

    it "rejects updates when finalized" do
      Setting.ihss_assignment_mode = "period"
      pay_period, employee, client = period_with_pair
      pay_period.update!(finalized_at: Time.current)

      patch ihss_period_path(pay_period), params: {
        assignments: [
          { employee_id: employee.id, client_id: client.id, hours: 4 },
        ],
      }

      expect(response).to redirect_to(ihss_period_path(pay_period))
      expect(Payroll::IhssPeriodAssignment.where(pay_period: pay_period)).to be_empty
    end
  end
end
