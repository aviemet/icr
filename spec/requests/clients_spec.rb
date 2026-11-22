require "rails_helper"
require_relative "../support/devise"

RSpec.describe "/clients" do
  def valid_attributes
    {
      client: {
        **attributes_for(:client),
        person_attributes: attributes_for(:person)
      }
    }
  end

  def invalid_attributes
    {
      client: { person_id: nil }
    }
  end

  describe "GET /index" do
    login_user(:admin)

    it "lists all clients" do
      clients = create_list(:client, 2)

      get clients_url

      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component "Clients/Index"
      expect(response.body).to include(CGI.escapeHTML(clients[0].person.first_name), CGI.escapeHTML(clients[1].person.first_name))
    end

    context "with search params" do
      it "lists only clients matching search params" do
        clients = create_list(:client, 2)

        get clients_url, params: { search: clients[0].person.first_name.downcase }

        expect(response).to have_http_status(:ok)
        expect_inertia.to render_component "Clients/Index"
        expect(response.body).to include(CGI.escapeHTML(clients[0].person.first_name))
        expect(response.body).not_to include(CGI.escapeHTML(clients[1].person.first_name))
      end
    end
  end

  describe "GET /show" do
    login_user(:admin)

    it "renders a successful response" do
      client = create(:client)

      get client_url(client)

      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component "Clients/Show"
    end

    it "includes future open shift count for admins" do
      client = create(:client)
      future_event = create(:calendar_event, starts_at: 1.day.from_now, ends_at: 1.day.from_now + 2.hours)
      create(:event_participant, calendar_event: future_event, participant: client)
      create(:shift, :open, calendar_event: future_event)
      past_event = create(:calendar_event, starts_at: 1.day.ago, ends_at: 1.day.ago + 2.hours)
      create(:event_participant, calendar_event: past_event, participant: client)
      create(:shift, :open, calendar_event: past_event)

      get client_url(client)

      expect(response).to have_http_status(:ok)
      expect(inertia.props[:can_view_open_shifts]).to be(true)
      expect(inertia.props[:open_shifts_count]).to eq(1)
    end

    it "ships overview props in lockstep for related collections" do
      client = create(:client, :with_profile)
      allergy = create(:client_allergy, client: client)
      diagnosis = create(:client_diagnosis, client: client)
      support_contact = create(:client_support_contact, client: client, is_emergency: true)
      create(:client_life_detail, client: client)
      manager = create(:employee)
      create(:clients_manager, client: client, manager: manager)
      attendant = create(:employee)
      create(:clients_attendant, client: client, attendant: attendant)
      doctor = create(:doctor)
      doctors_client = create(:doctors_client, client: client, doctor: doctor, notes: "PCP")
      medication = create(:medication)
      dosage = create(:dosage)
      prescription = create(:prescription, client: client, doctor: doctor, medication: medication, dosage: dosage, starts_at: Date.current, ends_at: nil)
      hospital_visit = create(:client_hospital_visit, client: client, doctor: doctor)
      vendor = create(:vendor)
      enrollment = create(:client_enrollment, client: client, vendor: vendor)
      training = create(:training)
      clients_training = create(:clients_training, client: client, training: training, required: true)

      get client_url(client)

      expect(response).to have_http_status(:ok)
      props = inertia.props[:client]
      expect(props[:allergies].pluck(:id)).to eq([allergy.id])
      expect(props[:diagnoses].pluck(:id)).to eq([diagnosis.id])
      expect(props[:support_contacts].pluck(:id)).to eq([support_contact.id])
      expect(props[:doctors].pluck(:id)).to eq([doctor.id])
      expect(props[:doctors_clients].pluck(:id)).to eq([doctors_client.id])
      expect(props[:doctors_clients].pluck(:doctor_id)).to eq([doctor.id])
      expect(props[:hospital_visits].pluck(:id)).to eq([hospital_visit.id])
      expect(props[:prescriptions].pluck(:id)).to eq([prescription.id])
      expect(props[:enrollments].pluck(:id)).to eq([enrollment.id])
      expect(props[:current_attendants].pluck(:id)).to eq([attendant.id])
      expect(props[:current_manager][:id]).to eq(manager.id)
      expect(props[:clients_trainings].pluck(:id)).to eq([clients_training.id])
      expect(props[:clients_trainings].pluck(:training_id)).to eq([training.id])
      expect(props[:clients_trainings].first[:required]).to be(true)
      expect(props[:active_allergies_count]).to eq(1)
      expect(props[:active_prescriptions_count]).to eq(1)
      expect(props[:emergency_contacts_count]).to eq(1)
      expect(props[:uci_number]).to eq(client.uci_number)
      expect(props[:life_detail][:adls]).to be_present
    end

  end

  describe "GET /new" do
    login_user(:admin)

    it "renders a successful response" do
      get new_client_url

      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component "Clients/New"
    end
  end

  describe "GET /edit" do
    login_user(:admin)

    it "renders a successful response" do
      client = create(:client)

      get edit_client_url(client)

      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component "Clients/Edit"
    end
  end

  describe "POST /create" do
    login_user(:admin)

    context "with valid parameters" do
      it "creates a new Client" do
        expect {
          post clients_url, params: valid_attributes
        }.to change(Client, :count).by(1)
      end

      it "redirects to the created client" do
        post clients_url, params: valid_attributes

        expect(response).to redirect_to(client_url(Client.last))
      end
    end

    context "with invalid parameters" do
      it "does not create a new Client" do
        expect {
          post clients_url, params: invalid_attributes
        }.not_to change(Client, :count)
      end

      it "redirects back to the new client page" do
        post clients_url, params: invalid_attributes
        expect(response).to redirect_to(new_client_url)
      end

    end
  end

  describe "PATCH /update" do
    login_user(:admin)

    context "with valid parameters" do
      it "updates the requested client" do
        client = create(:client)

        patch client_url(client), params: { client: { number: "changed" } }
        client.reload

        expect(client.number).to eq("changed")
      end

      it "redirects to the client profile tab" do
        client = create(:client)

        patch client_url(client), params: { client: { number: "changed" } }
        client.reload

        expect(response).to redirect_to(client_url(client, tab: "profile"))
      end

      it "updates CA and IHSS profile fields" do
        client = create(:client)

        patch client_url(client), params: {
          client: {
            uci_number: "1234567",
            regional_center: "RCEB",
            ihss_authorized_hours: 40.5,
            ihss_share_of_cost: 12.0,
            life_detail_attributes: {
              adls: "Needs meal support",
              risk_flags: "Elopement",
            },
          },
        }
        client.reload

        expect(client.uci_number).to eq("1234567")
        expect(client.regional_center).to eq("RCEB")
        expect(client.ihss_authorized_hours).to eq(40.5)
        expect(client.life_detail.adls).to eq("Needs meal support")
        expect(client.life_detail.risk_flags).to eq("Elopement")
      end
    end

    context "with invalid parameters" do
      it "redirects back to the edit client page" do
        client = create(:client)

        patch client_url(client), params: invalid_attributes

        expect(response).to redirect_to(edit_client_url(client))
      end

    end
  end

  describe "DELETE /destroy" do
    login_user(:admin)

    it "destroys the requested client" do
      client = create(:client)
      expect {
        delete client_url(client)
      }.to change(Client, :count).by(-1)
    end

    it "redirects to the clients list" do
      client = create(:client)
      delete client_url(client)
      expect(response).to redirect_to(clients_url)
    end
  end

  describe "GET /schedule" do
    login_user(:admin)

    it "renders a successful response" do
      client = create(:client)

      get schedule_client_url(client)

      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component "Clients/Schedule"
    end

    it "includes schedules within the date range" do
      client = create(:client)
      employee = create(:employee)

      # Create an event within the range
      in_range_shift = create(:shift, employee: employee)
      in_range_event = create(:calendar_event,
        shift: in_range_shift,
        starts_at: Time.current.beginning_of_month + 5.days,
        ends_at: Time.current.beginning_of_month + 5.days + 2.hours,)
      create(:event_participant, calendar_event: in_range_event, participant: client)

      # Create an event outside the range (month view can extend ~6 days before the 1st)
      out_of_range_shift = create(:shift, employee: employee)
      out_of_range_event = create(:calendar_event,
        shift: out_of_range_shift,
        starts_at: Time.current.beginning_of_month - 15.days,
        ends_at: Time.current.beginning_of_month - 15.days + 2.hours,)
      create(:event_participant, calendar_event: out_of_range_event, participant: client)

      # Request the current month's schedule
      get schedule_client_url(client), params: { view: "month", date: Time.current.to_date.to_s }

      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component "Clients/Schedule"

      schedule_ids = inertia.props[:schedules].map { |s| s[:id] } # rubocop:disable Rails/Pluck
      expect(schedule_ids).to include(in_range_event.id)
      expect(schedule_ids).not_to include(out_of_range_event.id)
    end

    it "expands recurring masters into occurrence rows with master_id and occurrence_starts_at" do
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

      get schedule_client_url(client), params: { view: "month", date: "2026-11-22" }

      expect(response).to have_http_status(:ok)
      schedules = inertia.props[:schedules]
      expect(schedules.length).to be >= 3
      expect(schedules).to all(include(master_id: master.id, is_recurring: true))
      expect(schedules.map { |row| row[:starts_at].to_date }).to include(
        Date.new(2026, 11, 16),
        Date.new(2026, 11, 23),
        Date.new(2026, 11, 30),
      )
      expect(schedules.pluck(:id)).to all(include("#{master.id}__"))
      expect(schedules.pluck(:occurrence_starts_at)).to all(be_present)
    end
  end
end
