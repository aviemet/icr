require "rails_helper"
require_relative "../support/devise"

RSpec.describe "/caseloads" do
  let!(:facilitator_title) { Employee::JobTitle.find_by!(slug: "facilitator") }
  let!(:facilitator) do
    create(:employee, :employed).tap do |employee|
      employee.assign_job_title(facilitator_title)
      employee.reload
    end
  end
  let!(:other_facilitator) do
    create(:employee, :employed).tap do |employee|
      employee.assign_job_title(facilitator_title)
      employee.reload
    end
  end
  let!(:assigned_client) { create(:client) }
  let!(:unassigned_client) { create(:client) }
  let!(:assignment) do
    create(:clients_manager, manager: facilitator, client: assigned_client, starts_at: 1.day.ago)
  end

  describe "as admin" do
    login_user(:admin)

    describe "GET /index" do
      it "renders lockstep facilitator and assignment props" do
        get caseloads_url

        expect(response).to be_successful
        props = inertia.props.deep_symbolize_keys

        facilitator_ids = props.fetch(:facilitators).map { |row| row.fetch(:id).to_s }
        expect(facilitator_ids).to include(facilitator.id.to_s)

        count_keys = props.fetch(:caseload_counts).keys.map(&:to_s)
        client_map_keys = props.fetch(:client_ids_by_facilitator).keys.map(&:to_s)
        expect(count_keys).to match_array(facilitator_ids)
        expect(client_map_keys).to match_array(facilitator_ids)

        assigned_ids = props.fetch(:clients).map { |row| row.fetch(:id).to_s }
        unassigned_ids = props.fetch(:unassigned_clients).map { |row| row.fetch(:id).to_s }
        expect(assigned_ids).to include(assigned_client.id.to_s)
        expect(unassigned_ids).to include(unassigned_client.id.to_s)
        expect(assigned_ids & unassigned_ids).to be_empty

        assignment_manager_ids = props.fetch(:assignments).map { |row| row.fetch(:manager_id).to_s }.uniq
        expect(assignment_manager_ids - facilitator_ids).to be_empty
      end
    end

    describe "POST /create" do
      it "creates a current ClientsManager and redirects" do
        expect {
          post caseloads_url, params: {
            clients_manager: {
              client_id: unassigned_client.id,
              manager_id: facilitator.id,
            },
          }
        }.to change(ClientsManager, :count).by(1)

        expect(response).to redirect_to(caseloads_url)
        created = ClientsManager.order(:created_at).last
        expect(created.client_id).to eq(unassigned_client.id)
        expect(created.manager_id).to eq(facilitator.id)
        expect(created.ends_at).to be_nil
      end
    end

    describe "PATCH /update" do
      it "sets ends_at on the assignment" do
        patch caseload_url(assignment)

        expect(response).to redirect_to(caseloads_url)
        expect(assignment.reload.ends_at).to be_present
      end

      it "reassigns the client to another facilitator" do
        expect {
          patch caseload_url(assignment), params: {
            clients_manager: {
              manager_id: other_facilitator.id,
            },
          }
        }.to change(ClientsManager, :count).by(1)

        expect(response).to redirect_to(caseloads_url)
        expect(assignment.reload.ends_at).to be_present

        created = ClientsManager.order(:created_at).last
        expect(created.client_id).to eq(assigned_client.id)
        expect(created.manager_id).to eq(other_facilitator.id)
        expect(created.ends_at).to be_nil
      end
    end
  end

  describe "as facilitator without clients_manager grants" do
    let(:job_title) { create(:job_title) }
    let(:employee) { create(:employee, :employed) }
    let(:user) do
      create(:user, person: employee.person).tap do
        employee.assign_job_title(job_title)
        employee.reload
      end
    end

    before { sign_in user }

    it "denies index" do
      get caseloads_url
      expect(response).to have_http_status(:redirect).or have_http_status(:forbidden)
    end

    it "denies create" do
      expect {
        post caseloads_url, params: {
          clients_manager: {
            client_id: unassigned_client.id,
            manager_id: facilitator.id,
          },
        }
      }.not_to change(ClientsManager, :count)
      expect(response).to have_http_status(:redirect).or have_http_status(:forbidden)
    end

    it "denies update" do
      patch caseload_url(assignment)
      expect(response).to have_http_status(:redirect).or have_http_status(:forbidden)
      expect(assignment.reload.ends_at).to be_nil
    end
  end
end
