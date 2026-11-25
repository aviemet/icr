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

    it "persists nested shift service_type_id from slug" do
      client = create(:client)
      employee = create(:employee, :employed)
      event_category = Category.type("Calendar::Event").find_or_create_by!(name: "Shift") { |category|
        category.system = true
      }
      overnight = ServiceType.find_or_create_by!(name: "Overnight") do |row|
        row.color = "#15803D"
        row.billable = true
        row.payable = true
      end
      params = {
        calendar_event: {
          starts_at: 1.day.from_now,
          ends_at: 1.day.from_now + 8.hours,
          category_id: event_category.id,
          shift_attributes: {
            employee_id: employee.id,
            service_type_id: overnight.slug,
          },
          event_participants_attributes: [
            { participant_id: client.id, participant_type: "Client" },
          ],
        },
      }

      expect {
        post api_calendar_events_url, params: params
      }.to change(Shift, :count).by(1)

      expect(response).to have_http_status(:created)
      expect(Shift.order(created_at: :desc).first.service_type_id).to eq(overnight.id)
    end

    it "persists mileage on the nested shift" do
      client = create(:client)
      employee = create(:employee, :employed)
      event_category = Category.type("Calendar::Event").find_or_create_by!(name: "Shift") { |category|
        category.system = true
      }
      params = {
        calendar_event: {
          starts_at: 1.day.from_now,
          ends_at: 1.day.from_now + 8.hours,
          category_id: event_category.id,
          shift_attributes: {
            employee_id: employee.id,
            mileage: 12.5,
          },
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
      expect(shift.mileage).to eq(12.5)
      expect(response.parsed_body.dig("shift", "mileage")).to eq("12.5")
    end

    it "rejects multi-client participants when the service type disallows them" do
      client_one = create(:client)
      client_two = create(:client)
      employee = create(:employee, :employed)
      event_category = Category.type("Calendar::Event").find_or_create_by!(name: "Shift") { |category|
        category.system = true
      }
      service_type = create(:service_type, allows_multi_client: false)
      params = {
        calendar_event: {
          starts_at: 1.day.from_now,
          ends_at: 1.day.from_now + 8.hours,
          category_id: event_category.id,
          shift_attributes: {
            employee_id: employee.id,
            service_type_id: service_type.id,
          },
          event_participants_attributes: [
            { participant_id: client_one.id, participant_type: "Client" },
            { participant_id: client_two.id, participant_type: "Client" },
          ],
        },
      }

      post api_calendar_events_url, params: params

      expect(response).to have_http_status(:unprocessable_content)
      expect(response.parsed_body.dig("errors", "base")).to be_present
    end

    it "requires notes when the service type requires them" do
      client = create(:client)
      employee = create(:employee, :employed)
      event_category = Category.type("Calendar::Event").find_or_create_by!(name: "Shift") { |category|
        category.system = true
      }
      service_type = create(:service_type, :notes_required)
      params = {
        calendar_event: {
          starts_at: 1.day.from_now,
          ends_at: 1.day.from_now + 8.hours,
          category_id: event_category.id,
          notes: "",
          shift_attributes: {
            employee_id: employee.id,
            service_type_id: service_type.id,
          },
          event_participants_attributes: [
            { participant_id: client.id, participant_type: "Client" },
          ],
        },
      }

      post api_calendar_events_url, params: params

      expect(response).to have_http_status(:unprocessable_content)
      expect(response.parsed_body.dig("errors", "notes")).to be_present
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

    it "rejects create when client schedule requirements are unmet" do
      client = create(:client)
      employee = create(:employee, :employed)
      training = create(:training, name: "Household Protocol")
      requirement = create(:requirement, :for_client, scope: client, name: "Protocol")
      create(:requirement_item, requirement: requirement, fulfillable: training)
      shift_category = Category.type("Calendar::Event").find_or_create_by!(name: "Shift") { |category|
        category.system = true
      }
      params = {
        calendar_event: {
          starts_at: 1.day.from_now,
          ends_at: 1.day.from_now + 8.hours,
          category_id: shift_category.id,
          shift_attributes: { employee_id: employee.id },
          event_participants_attributes: [
            { participant_id: client.id, participant_type: "Client" },
          ],
        },
      }

      expect {
        post api_calendar_events_url, params: params
      }.not_to change(Calendar::Event, :count)

      expect(response).to have_http_status(:unprocessable_content)
      expect(response.parsed_body["errors"]["base"]).to include("Protocol")
    end

    it "creates when client schedule requirements are met" do
      client = create(:client)
      employee = create(:employee, :employed)
      training = create(:training, name: "Household Protocol")
      requirement = create(:requirement, :for_client, scope: client, name: "Protocol")
      create(:requirement_item, requirement: requirement, fulfillable: training)
      create(:employees_training, :completed, employee: employee, training: training)
      shift_category = Category.type("Calendar::Event").find_or_create_by!(name: "Shift") { |category|
        category.system = true
      }
      params = {
        calendar_event: {
          starts_at: 1.day.from_now,
          ends_at: 1.day.from_now + 8.hours,
          category_id: shift_category.id,
          shift_attributes: { employee_id: employee.id },
          event_participants_attributes: [
            { participant_id: client.id, participant_type: "Client" },
          ],
        },
      }

      expect {
        post api_calendar_events_url, params: params
      }.to change(Calendar::Event, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it "attaches an assigned shift to the employee's timesheet for the period" do
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:semi_monthly]
      travel_to Time.zone.local(2024, 3, 10, 12, 0, 0) do
        client = create(:client)
        employee = create(:employee)
        shift_category = Category.type("Calendar::Event").find_or_create_by!(name: "Shift") { |category|
          category.system = true
        }
        params = {
          calendar_event: {
            starts_at: Time.zone.local(2024, 3, 20, 9, 0, 0),
            ends_at: Time.zone.local(2024, 3, 20, 17, 0, 0),
            category_id: shift_category.id,
            shift_attributes: { employee_id: employee.id },
            event_participants_attributes: [
              { participant_id: client.id, participant_type: "Client" },
            ],
          },
        }

        post api_calendar_events_url, params: params

        expect(response).to have_http_status(:created)
        shift = Shift.order(created_at: :desc).first
        expect(shift.employee_id).to eq(employee.id)
        expect(shift.timesheet).to be_present
        expect(shift.timesheet.employee_id).to eq(employee.id)
        expect(shift.timesheet.pay_period.starts_at.to_date).to eq(Date.new(2024, 3, 16))
        expect(shift.calendar_event.clients).to contain_exactly(client)
      end
    end

    it "rejects create when the containing pay period is finalized" do
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:semi_monthly]
      travel_to Time.zone.local(2024, 3, 10, 12, 0, 0) do
        employee = create(:employee)
        client = create(:client)
        pay_period = PayPeriod.for_period_dates(Date.new(2024, 3, 16), Date.new(2024, 3, 31))
        pay_period.update!(finalized_at: Time.current)
        shift_category = Category.type("Calendar::Event").find_or_create_by!(name: "Shift") { |category|
          category.system = true
        }
        params = {
          calendar_event: {
            starts_at: Time.zone.local(2024, 3, 20, 9, 0, 0),
            ends_at: Time.zone.local(2024, 3, 20, 17, 0, 0),
            category_id: shift_category.id,
            shift_attributes: { employee_id: employee.id },
            event_participants_attributes: [
              { participant_id: client.id, participant_type: "Client" },
            ],
          },
        }

        expect {
          post api_calendar_events_url, params: params
        }.not_to change(Shift, :count)

        expect(response).to have_http_status(:unprocessable_content)
        expect(response.parsed_body["errors"]["base"]).to eq(I18n.t("pay_periods.finalized_locked"))
      end
    end

    it "clears timesheet approval when attaching a new shift" do
      Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:semi_monthly]
      travel_to Time.zone.local(2024, 3, 10, 12, 0, 0) do
        client = create(:client)
        employee = create(:employee)
        existing = create(
          :shift,
          employee: employee,
          calendar_event: create(
            :calendar_event,
            starts_at: Time.zone.local(2024, 3, 18, 9, 0, 0),
            ends_at: Time.zone.local(2024, 3, 18, 17, 0, 0),
          ),
        )
        timesheet = existing.reload.timesheet
        timesheet.update!(approved_at: Time.current)
        shift_category = Category.type("Calendar::Event").find_or_create_by!(name: "Shift") { |category|
          category.system = true
        }
        params = {
          calendar_event: {
            starts_at: Time.zone.local(2024, 3, 20, 9, 0, 0),
            ends_at: Time.zone.local(2024, 3, 20, 17, 0, 0),
            category_id: shift_category.id,
            shift_attributes: { employee_id: employee.id },
            event_participants_attributes: [
              { participant_id: client.id, participant_type: "Client" },
            ],
          },
        }

        post api_calendar_events_url, params: params

        expect(response).to have_http_status(:created)
        expect(timesheet.reload.approved_at).to be_nil
      end
    end

    it "stores recurring patterns without materializing child events" do
      client = create(:client)
      employee = create(:employee)
      shift_category = Category.type("Calendar::Event").find_or_create_by!(name: "Shift") { |category|
        category.system = true
      }
      starts_at = Time.zone.parse("2026-11-16 09:00")
      ends_at = Time.zone.parse("2026-11-16 17:00")
      end_date = Date.parse("2026-11-23")
      params = {
        calendar_event: {
          starts_at: starts_at,
          ends_at: ends_at,
          category_id: shift_category.id,
          shift_attributes: { employee_id: employee.id },
          event_participants_attributes: [
            { participant_id: client.id, participant_type: "Client" },
          ],
          recurring_patterns_attributes: [
            { recurring_type: "weekly", offset: 1, day_of_week: 1, end_date: end_date },
          ],
        },
      }

      expect {
        post api_calendar_events_url, params: params
      }.to change(Calendar::Event, :count).by(1)
        .and change(Shift, :count).by(1)
        .and change(Calendar::RecurringPattern, :count).by(1)

      expect(response).to have_http_status(:created)
      master = Calendar::Event.find(response.parsed_body["id"])
      expect(master.children).to be_empty
      expect(master.recurring_patterns.count).to eq(1)
      expect(response.parsed_body["recurring_patterns"]).to be_present
    end

    it "stores daily, monthly, and yearly pattern anchors" do
      client = create(:client)
      other_category = Category.type("Calendar::Event").find_or_create_by!(name: "Other") { |category|
        category.system = true
      }
      starts_at = Time.zone.parse("2026-11-16 09:00")
      ends_at = Time.zone.parse("2026-11-16 10:00")

      [
        [{ recurring_type: "daily", offset: 1, max_occurrences: 5 }, ->(pattern) {
          expect(pattern.recurring_type).to eq("daily")
          expect(pattern.max_occurrences).to eq(5)
        }],
        [{ recurring_type: "monthly", offset: 1, day_of_month: 16 }, ->(pattern) {
          expect(pattern.recurring_type).to eq("monthly")
          expect(pattern.day_of_month).to eq(16)
        }],
        [{ recurring_type: "yearly", offset: 1, month_of_year: 11, day_of_month: 16 }, ->(pattern) {
          expect(pattern.recurring_type).to eq("yearly")
          expect(pattern.month_of_year).to eq(11)
          expect(pattern.day_of_month).to eq(16)
        }],
      ].each do |pattern_attrs, expectations|
        params = {
          calendar_event: {
            name: "Meeting",
            starts_at: starts_at,
            ends_at: ends_at,
            category_id: other_category.id,
            event_participants_attributes: [
              { participant_id: client.id, participant_type: "Client" },
            ],
            recurring_patterns_attributes: [pattern_attrs],
          },
        }

        post api_calendar_events_url, params: params
        expect(response).to have_http_status(:created)
        pattern = Calendar::Event.find(response.parsed_body["id"]).recurring_patterns.sole
        expectations.call(pattern)
      end
    end
  end

  describe "PATCH occurrence edit scopes" do
    let(:client) { create(:client) }
    let(:employee) { create(:employee) }
    let(:shift_category) {
      Category.type("Calendar::Event").find_or_create_by!(name: "Shift") { |category| category.system = true }
    }
    let(:starts_at) { Time.zone.parse("2026-11-16 09:00") }
    let(:ends_at) { Time.zone.parse("2026-11-16 17:00") }
    let!(:master) do
      event = Calendar::Event.new(
        starts_at: starts_at,
        ends_at: ends_at,
        category_id: shift_category.id,
      )
      event.event_participants.build(participant_id: client.id, participant_type: "Client")
      event.build_shift(employee_id: employee.id)
      event.recurring_patterns.build(
        recurring_type: :weekly,
        offset: 1,
        day_of_week: 1,
        end_date: Date.parse("2026-12-31"),
      )
      event.save!
      event
    end

    it "cancels one occurrence and creates a detached event when edit_scope is one" do
      occurrence = Time.zone.parse("2026-11-23 09:00")
      params = {
        calendar_event: {
          starts_at: Time.zone.parse("2026-11-23 10:00"),
          ends_at: Time.zone.parse("2026-11-23 18:00"),
          edit_scope: "one",
          occurrence_starts_at: occurrence.iso8601,
          shift_attributes: { employee_id: employee.id },
        },
      }

      expect {
        patch api_calendar_event_url(master), params: params
      }.to change(Calendar::EventException, :count).by(1)
        .and change(Calendar::Event, :count).by(1)

      expect(response).to have_http_status(:created)
      expect(master.reload.event_exceptions.sole.cancelled).to eq(occurrence)
      detached = Calendar::Event.where.not(id: master.id).order(:created_at).last
      expect(detached.starts_at).to eq(Time.zone.parse("2026-11-23 10:00"))
      expect(detached.recurring_patterns).to be_empty
    end

    it "shifts the series by the occurrence delta when edit_scope is all" do
      occurrence = Time.zone.parse("2026-11-23 09:00")
      params = {
        calendar_event: {
          starts_at: Time.zone.parse("2026-11-25 10:00"),
          ends_at: Time.zone.parse("2026-11-25 18:00"),
          edit_scope: "all",
          occurrence_starts_at: occurrence.iso8601,
        },
      }

      patch api_calendar_event_url(master), params: params

      expect(response).to have_http_status(:created)
      master.reload
      expect(master.starts_at).to eq(Time.zone.parse("2026-11-18 10:00"))
      expect(master.ends_at).to eq(Time.zone.parse("2026-11-18 18:00"))
    end

    it "updates a non-recurring event date from the form when edit_scope is all" do
      other_category = Category.type("Calendar::Event").find_or_create_by!(name: "Other") { |category|
        category.system = true
      }
      single = Calendar::Event.new(
        name: "Meeting",
        starts_at: Time.zone.parse("2026-11-10 09:00"),
        ends_at: Time.zone.parse("2026-11-10 10:00"),
        category_id: other_category.id,
      )
      single.event_participants.build(participant_id: client.id, participant_type: "Client")
      single.save!

      params = {
        calendar_event: {
          starts_at: Time.zone.parse("2026-11-20 11:00"),
          ends_at: Time.zone.parse("2026-11-20 12:00"),
          edit_scope: "all",
        },
      }

      patch api_calendar_event_url(single), params: params

      expect(response).to have_http_status(:created)
      single.reload
      expect(single.starts_at).to eq(Time.zone.parse("2026-11-20 11:00"))
      expect(single.ends_at).to eq(Time.zone.parse("2026-11-20 12:00"))
    end

    it "truncates the series and creates a continuation when edit_scope is future" do
      occurrence = Time.zone.parse("2026-11-23 09:00")
      params = {
        calendar_event: {
          starts_at: Time.zone.parse("2026-11-23 10:00"),
          ends_at: Time.zone.parse("2026-11-23 18:00"),
          edit_scope: "future",
          occurrence_starts_at: occurrence.iso8601,
          shift_attributes: { employee_id: employee.id },
        },
      }

      expect {
        patch api_calendar_event_url(master), params: params
      }.to change(Calendar::Event, :count).by(1)

      expect(response).to have_http_status(:created)
      master.reload
      expect(master.starts_at).to eq(starts_at)
      expect(master.recurring_patterns.sole.end_date).to eq(Date.parse("2026-11-22"))

      continuation = Calendar::Event.where.not(id: master.id).order(:created_at).last
      expect(continuation.starts_at).to eq(Time.zone.parse("2026-11-23 10:00"))
      expect(continuation.ends_at).to eq(Time.zone.parse("2026-11-23 18:00"))
      expect(continuation.recurring_patterns.sole.recurring_type).to eq("weekly")
      expect(continuation.recurring_patterns.sole.end_date).to eq(Date.parse("2026-12-31"))
      expect(continuation.shift.employee_id).to eq(employee.id)
    end

    it "treats future edits of the first occurrence as all" do
      params = {
        calendar_event: {
          starts_at: Time.zone.parse("2026-11-16 10:00"),
          ends_at: Time.zone.parse("2026-11-16 18:00"),
          edit_scope: "future",
          occurrence_starts_at: starts_at.iso8601,
        },
      }

      expect {
        patch api_calendar_event_url(master), params: params
      }.not_to change(Calendar::Event, :count)

      expect(response).to have_http_status(:created)
      master.reload
      expect(master.starts_at).to eq(Time.zone.parse("2026-11-16 10:00"))
      expect(master.recurring_patterns.sole.end_date).to eq(Date.parse("2026-12-31"))
    end

    it "replaces series patterns when edit_scope is all" do
      params = {
        calendar_event: {
          starts_at: Time.zone.parse("2026-11-16 10:00"),
          ends_at: Time.zone.parse("2026-11-16 18:00"),
          edit_scope: "all",
          recurring_patterns_attributes: [
            { recurring_type: "daily", offset: 2, max_occurrences: 4 },
          ],
        },
      }

      patch api_calendar_event_url(master), params: params

      expect(response).to have_http_status(:created)
      master.reload
      expect(master.recurring_patterns.count).to eq(1)
      pattern = master.recurring_patterns.sole
      expect(pattern.recurring_type).to eq("daily")
      expect(pattern.offset).to eq(2)
      expect(pattern.max_occurrences).to eq(4)
    end

    it "clears series patterns when edit_scope is all and attributes are empty" do
      params = {
        calendar_event: {
          starts_at: starts_at,
          ends_at: ends_at,
          edit_scope: "all",
          recurring_patterns_attributes: [],
        },
      }

      patch api_calendar_event_url(master), params: params

      expect(response).to have_http_status(:created)
      expect(master.reload.recurring_patterns).to be_empty
    end
  end

  describe "DELETE occurrence scopes" do
    let(:client) { create(:client) }
    let(:shift_category) {
      Category.type("Calendar::Event").find_or_create_by!(name: "Shift") { |category| category.system = true }
    }
    let!(:master) do
      event = Calendar::Event.new(
        name: "Meeting",
        starts_at: Time.zone.parse("2026-11-16 09:00"),
        ends_at: Time.zone.parse("2026-11-16 10:00"),
        category_id: shift_category.id,
      )
      event.event_participants.build(participant_id: client.id, participant_type: "Client")
      event.recurring_patterns.build(
        recurring_type: :weekly,
        offset: 1,
        day_of_week: 1,
      )
      event.save!
      event
    end

    it "cancels one occurrence without destroying the master" do
      occurrence = Time.zone.parse("2026-11-23 09:00")

      expect {
        delete api_calendar_event_url(master), params: {
          edit_scope: "one",
          occurrence_starts_at: occurrence.iso8601,
        }
      }.to change(Calendar::EventException, :count).by(1)

      expect(response).to have_http_status(:no_content)
      expect(Calendar::Event.exists?(master.id)).to be(true)
    end

    it "truncates the series for this and future without destroying the master" do
      occurrence = Time.zone.parse("2026-11-23 09:00")
      master.recurring_patterns.sole.update!(end_date: Date.parse("2026-12-31"))

      expect {
        delete api_calendar_event_url(master), params: {
          edit_scope: "future",
          occurrence_starts_at: occurrence.iso8601,
        }
      }.not_to(change { [Calendar::Event.count, Calendar::EventException.count] })

      expect(response).to have_http_status(:no_content)
      expect(Calendar::Event.exists?(master.id)).to be(true)
      expect(master.reload.recurring_patterns.sole.end_date).to eq(Date.parse("2026-11-22"))
    end

    it "destroys the master when this and future targets the series start" do
      expect {
        delete api_calendar_event_url(master), params: {
          edit_scope: "future",
          occurrence_starts_at: master.starts_at.iso8601,
        }
      }.to change(Calendar::Event, :count).by(-1)

      expect(response).to have_http_status(:no_content)
      expect(Calendar::Event.exists?(master.id)).to be(false)
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
