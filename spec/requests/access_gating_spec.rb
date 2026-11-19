# frozen_string_literal: true

require "rails_helper"
require_relative "../support/devise"

RSpec.describe "Access gating" do
  let(:job_title) { create(:job_title) }
  let(:facilitator) { create(:employee, :employed) }
  let(:facilitator_user) do
    create(:user, person: facilitator.person).tap do
      facilitator.assign_job_title(job_title)
      facilitator.reload
    end
  end
  let(:attendant) { create(:employee, :employed) }
  let(:attendant_user) { create(:user, person: attendant.person) }
  let(:managed_client) { create(:client) }
  let(:other_client) { create(:client) }

  before do
    job_title.add_role(:index, Client)
    job_title.add_role(:show, Client)
    job_title.add_role(:index, Employee)
    job_title.add_role(:show, Employee)
    job_title.add_role(:show, Timesheet)
    job_title.add_role(:update, Timesheet)
    create(:clients_manager, client: managed_client, manager: facilitator, starts_at: 1.day.ago)
    create(:clients_attendant, client: managed_client, attendant: attendant, starts_at: 1.day.ago)
    create(:employees_manager, employee: attendant, manager: facilitator, starts_at: 1.day.ago)
  end

  describe "as facilitator" do
    before { sign_in facilitator_user }

    it "lists employees and ships can_updates lockstep with rendered ids" do
      get employees_url

      expect(response).to have_http_status(:ok)
      props = inertia.props.deep_symbolize_keys
      employee_ids = props.fetch(:employees).map { |row| row.fetch(:id).to_s }
      can_updates = props.fetch(:can_updates).transform_keys(&:to_s)
      expect(can_updates.keys).to match_array(employee_ids)
      expect(can_updates.fetch(attendant.id.to_s)).to be(true)
    end

    it "lists clients with can_updates lockstep matching policy update?" do
      get clients_url

      expect(response).to have_http_status(:ok)
      props = inertia.props.deep_symbolize_keys
      client_ids = props.fetch(:clients).map { |row| row.fetch(:id).to_s }
      can_updates = props.fetch(:can_updates).transform_keys(&:to_s)

      expect(can_updates.keys).to match_array(client_ids)
      client_ids.each do |client_id|
        client = Client.find(client_id)
        expect(can_updates.fetch(client_id)).to eq(Pundit.policy(facilitator_user, client).update?)
      end
    end

    it "allows editing a managed client and denies an unmanaged client" do
      get client_url(managed_client)
      expect(response).to have_http_status(:ok)
      expect(inertia.props.deep_symbolize_keys.fetch(:can_update)).to be(true)

      get client_url(other_client)
      expect(response).to have_http_status(:ok)
      expect(inertia.props.deep_symbolize_keys.fetch(:can_update)).to be(false)

      get edit_client_url(managed_client)
      expect(response).to have_http_status(:ok)

      get edit_client_url(other_client)
      expect(response).to have_http_status(:redirect).or have_http_status(:forbidden)
    end

    it "opens payroll index with timesheet show/update grants" do
      get payroll_periods_url
      expect(response).to have_http_status(:ok)
    end
  end

  describe "as attendant" do
    before { sign_in attendant_user }

    it "shows own employee record without update" do
      get employee_url(attendant)

      expect(response).to have_http_status(:ok)
      props = inertia.props.deep_symbolize_keys
      expect(props.fetch(:can_update)).to be(false)
    end

    it "shows assigned client and denies other clients" do
      get client_url(managed_client)
      expect(response).to have_http_status(:ok)

      get client_url(other_client)
      expect(response).to have_http_status(:not_found).or have_http_status(:redirect)
    end

    it "denies the full employees index" do
      get employees_url
      expect(response).to have_http_status(:redirect).or have_http_status(:forbidden)
    end
  end

  describe "as client" do
    let(:client_record) { create(:client) }
    let(:client_user) { create(:user, person: client_record.person) }

    before { sign_in client_user }

    it "shows and can update own client record" do
      get client_url(client_record)

      expect(response).to have_http_status(:ok)
      props = inertia.props.deep_symbolize_keys
      expect(props.fetch(:can_update)).to be(true)
    end
  end
end
