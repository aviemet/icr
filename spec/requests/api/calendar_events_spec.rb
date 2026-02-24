require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Api::CalendarEvents", type: :request do
  login_user(:admin)

  describe "POST /create" do
    it "creates a calendar event and returns 201" do
      category = Category.type("Calendar::Event").find_or_create_by!(name: "Other") { |c| c.system = true }
      params = {
        calendar_event: {
          name: "Test",
          starts_at: 1.hour.from_now,
          ends_at: 2.hours.from_now,
          category_id: category.id
        }
      }

      expect {
        post api_calendar_events_url, params: params
      }.to change(Calendar::Event, :count).by(1)

      expect(response).to have_http_status(:created)

      json = response.parsed_body
      expect(json["name"]).to eq("Test")

      created_event = Calendar::Event.order(created_at: :desc).first
      expect(created_event.category_id).to eq(category.id)
    end
  end
end
