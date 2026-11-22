require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Api::Clients", type: :request do
  login_user(:admin)

  describe "GET /options" do
    it "returns option data for all clients" do
      clients = create_list(:client, 2)

      get api_clients_options_url
      expect(response).to be_successful

      json = response.parsed_body
      slugs = clients.map(&:slug)

      expect(json).not_to be_empty
      expect(json.pluck("slug")).to include(*slugs)
    end
  end

  describe "GET /api/clients/:slug/schedule" do
    it "returns expanded recurring occurrences for the requested range" do
      client = create(:client)
      employee = create(:employee)
      master = create(
        :calendar_event,
        starts_at: Time.zone.local(2026, 10, 1, 9, 0, 0),
        ends_at: Time.zone.local(2026, 10, 1, 17, 0, 0),
      )
      create(
        :calendar_recurring_pattern,
        calendar_event: master,
        recurring_type: :weekly,
        offset: 1,
        day_of_week: 1,
        end_date: nil,
        max_occurrences: nil,
      )
      create(:shift, employee:, calendar_event: master)
      create(:event_participant, calendar_event: master, participant: client)

      get api_client_schedule_url(client), params: { view: "month", date: "2026-11-22" }

      expect(response).to be_successful
      json = response.parsed_body
      expect(json.length).to be >= 3
      expect(json).to all(include("master_id" => master.id, "is_recurring" => true))
      expect(json.map { |row| Time.zone.parse(row["starts_at"]).to_date }).to include(
        Date.new(2026, 11, 16),
        Date.new(2026, 11, 23),
        Date.new(2026, 11, 30),
      )
    end
  end
end
