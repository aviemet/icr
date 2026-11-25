require "rails_helper"
require_relative "../support/devise"

RSpec.describe "/households" do
  login_user(:admin)

  describe "GET /index" do
    it "renders a successful response" do
      create(:household)

      get households_url

      expect(response).to be_successful
      expect_inertia.to render_component "Households/Index"
    end
  end

  describe "GET /show" do
    it "renders a successful response with lockstep membership client ids" do
      household = create(:household)
      current_client = create(:client)
      former_client = create(:client)
      create(:households_client, household: household, client: current_client)
      create(
        :households_client,
        household: household,
        client: former_client,
        starts_at: 30.days.ago.to_date,
        ends_at: 1.day.ago.to_date,
      )

      get household_url(household)

      expect(response).to be_successful
      expect_inertia.to render_component "Households/Show"

      props = inertia.props[:household]
      client_ids = props[:clients].pluck(:id)
      current_ids = props[:current_memberships].pluck(:client_id)
      past_ids = props[:past_memberships].pluck(:client_id)

      expect(client_ids).to contain_exactly(current_client.id)
      expect(current_ids).to contain_exactly(current_client.id)
      expect(past_ids).to contain_exactly(former_client.id)
      expect(current_ids & past_ids).to be_empty
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_household_url

      expect(response).to be_successful
      expect_inertia.to render_component "Households/New"
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      household = create(:household)

      get edit_household_url(household)

      expect(response).to be_successful
      expect_inertia.to render_component "Households/Edit"
    end
  end

  describe "POST /create" do
    it "creates a household with a name" do
      expect {
        post households_url, params: { household: { name: "Santos Home" } }
      }.to change(Household, :count).by(1)

      household = Household.order(:created_at).last
      expect(household.name).to eq("Santos Home")
      expect(response).to redirect_to(household_url(household))
    end
  end

  describe "PATCH /update" do
    it "updates the household name and redirects to the profile tab" do
      household = create(:household, name: "Old Name")

      patch household_url(household), params: {
        tab: "profile",
        household: { name: "New Name" },
      }

      expect(household.reload.name).to eq("New Name")
      expect(response).to redirect_to(household_url(household, tab: "profile"))
    end
  end

  describe "memberships" do
    it "assigns a client to the household" do
      household = create(:household)
      client = create(:client)

      expect {
        post household_memberships_url(household), params: {
          households_client: { client_id: client.id, starts_at: Date.current },
        }
      }.to change(HouseholdsClient, :count).by(1)

      expect(client.reload.household).to eq(household)
      expect(response).to redirect_to(household_url(household, tab: "clients"))
    end

    it "ends a membership" do
      household = create(:household)
      client = create(:client)
      membership = create(
        :households_client,
        household: household,
        client: client,
        starts_at: 10.days.ago.to_date,
      )

      patch household_membership_url(household, membership), params: {
        households_client: { ends_at: Date.yesterday },
      }

      expect(membership.reload.ends_at).to eq(Date.yesterday)
      expect(client.reload.household).to be_nil
      expect(response).to redirect_to(household_url(household, tab: "clients"))
    end

    it "updates membership starts_at" do
      household = create(:household)
      client = create(:client)
      membership = create(
        :households_client,
        household: household,
        client: client,
        starts_at: 10.days.ago.to_date,
      )

      patch household_membership_url(household, membership), params: {
        households_client: { starts_at: 5.days.ago.to_date },
      }

      expect(membership.reload.starts_at).to eq(5.days.ago.to_date)
      expect(membership.ends_at).to be_nil
      expect(response).to redirect_to(household_url(household, tab: "clients"))
    end
  end

  describe "GET /schedule" do
    it "renders a successful response" do
      household = create(:household)

      get schedule_household_url(household)

      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component "Households/Schedule"
    end

    it "includes schedules for clients in the household within the date range" do
      household = create(:household)
      client_in_household = create(:client)
      create(
        :households_client,
        household: household,
        client: client_in_household,
        starts_at: Time.current.beginning_of_month.to_date,
      )

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

    it "includes former member shifts only during membership" do
      household = create(:household)
      client = create(:client)
      employee = create(:employee)
      membership_start = Time.current.beginning_of_month + 2.days
      membership_end = Time.current.beginning_of_month + 10.days
      create(
        :households_client,
        household: household,
        client: client,
        starts_at: membership_start.to_date,
        ends_at: membership_end.to_date,
      )

      inside_shift = create(:shift, employee: employee)
      inside_event = create(
        :calendar_event,
        shift: inside_shift,
        starts_at: membership_start + 1.day,
        ends_at: membership_start + 1.day + 2.hours,
      )
      create(:event_participant, calendar_event: inside_event, participant: client)

      outside_shift = create(:shift, employee: employee)
      outside_event = create(
        :calendar_event,
        shift: outside_shift,
        starts_at: membership_end + 2.days,
        ends_at: membership_end + 2.days + 2.hours,
      )
      create(:event_participant, calendar_event: outside_event, participant: client)

      get schedule_household_url(household), params: { view: "month", date: Time.current.to_date.to_s }

      schedule_ids = inertia.props[:schedules].pluck(:id)
      expect(schedule_ids).to include(inside_event.id)
      expect(schedule_ids).not_to include(outside_event.id)
    end
  end
end
