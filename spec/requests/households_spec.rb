require "rails_helper"
require_relative "../support/devise"

RSpec.describe "/households", :inertia do
  describe "GET /schedule" do
    login_user(:admin)

    it "renders a successful response" do
      household = create(:household)

      get schedule_household_url(household)

      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component "Households/Schedule"
    end

    it "includes schedules for clients in the household within the date range" do
      household = create(:household)
      client_in_household = create(:client)
      create(:households_client, household: household, client: client_in_household)

      other_client = create(:client)
      employee = create(:employee)

      in_range_shift = create(:shift, employee: employee)
      in_range_event = create(:calendar_event,
        shift: in_range_shift,
        starts_at: Time.current.beginning_of_month + 5.days,
        ends_at: Time.current.beginning_of_month + 5.days + 2.hours,)
      create(:event_participant, calendar_event: in_range_event, participant: client_in_household)

      out_of_household_shift = create(:shift, employee: employee)
      out_of_household_event = create(:calendar_event,
        shift: out_of_household_shift,
        starts_at: Time.current.beginning_of_month + 6.days,
        ends_at: Time.current.beginning_of_month + 6.days + 2.hours,)
      create(:event_participant, calendar_event: out_of_household_event, participant: other_client)

      out_of_range_shift = create(:shift, employee: employee)
      out_of_range_event = create(:calendar_event,
        shift: out_of_range_shift,
        starts_at: Time.current.beginning_of_month - 15.days,
        ends_at: Time.current.beginning_of_month - 15.days + 2.hours,)
      create(:event_participant, calendar_event: out_of_range_event, participant: client_in_household)

      get schedule_household_url(household), params: { view: "month", date: Time.current.to_date.to_s }

      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component "Households/Schedule"

      schedule_ids = inertia.props[:schedules].pluck(:id)
      expect(schedule_ids).to include(in_range_event.id)
      expect(schedule_ids).not_to include(out_of_range_event.id)
      expect(schedule_ids).not_to include(out_of_household_event.id)
    end
  end
end
