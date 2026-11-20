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

    it "creates an open shift when employee_id is blank" do
      client = create(:client)
      shift_category = Category.type("Calendar::Event").find_or_create_by!(name: "Shift") { |category|
        category.system = true
      }
      params = {
        calendar_event: {
          starts_at: 1.day.from_now,
          ends_at: 1.day.from_now + 8.hours,
          category_id: shift_category.id,
          shift_attributes: { employee_id: "" },
          event_participants_attributes: [
            { participant_id: client.id, participant_type: "Client" },
          ],
        },
      }

      expect {
        post api_calendar_events_url, params: params
      }.to change(Shift, :count).by(1)

      expect(response).to have_http_status(:created)
      shift = Shift.order(created_at: :desc).first
      expect(shift.employee_id).to be_nil
      expect(shift).to be_open
      expect(shift.calendar_event.clients).to contain_exactly(client)
    end

    it "returns unprocessable content with string errors when invalid" do
      shift_category = Category.type("Calendar::Event").find_or_create_by!(name: "Shift") { |category|
        category.system = true
      }
      params = {
        calendar_event: {
          starts_at: 2.hours.from_now,
          ends_at: 1.hour.from_now,
          category_id: shift_category.id,
          shift_attributes: { employee_id: "" },
        },
      }

      post api_calendar_events_url, params: params

      expect(response).to have_http_status(:unprocessable_content)
      expect(response.parsed_body["errors"]).to include("ends_at")
      expect(response.parsed_body["errors"]["ends_at"]).to be_a(String)
    end
  end

  describe "DELETE /api/calendar_events/:id" do
    it "destroys a shift event and its shift while the period is open" do
      employee = create(:employee)
      shift = create(:shift, employee: employee)
      event = Calendar::Event.find(shift.calendar_event_id)

      expect {
        delete api_calendar_event_url(event)
      }.to change(Calendar::Event, :count).by(-1)
        .and change(Shift, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end

    it "rejects destroy when the pay period is finalized" do
      employee = create(:employee)
      shift = create(:shift, employee: employee)
      event = Calendar::Event.find(shift.calendar_event_id)
      shift.timesheet.pay_period.update!(finalized_at: Time.current)

      expect {
        delete api_calendar_event_url(event)
      }.not_to change(Calendar::Event, :count)

      expect(response).to have_http_status(:unprocessable_entity)
      expect(Shift.exists?(shift.id)).to be(true)
    end
  end
end
