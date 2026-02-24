require "rails_helper"
require_relative "../support/devise"

RSpec.describe "/incident_reports" do
  login_user(:admin)

  def valid_attributes
    client = create(:client)
    reported_by_employee = create(:employee, :employed)
    reported_to_employee = create(:employee, :employed)
    {
      incident_report: {
        **attributes_for(:incident_report).except(:client_id, :reported_by_id, :reported_to_id),
        client_id: client.id,
        reported_by_id: reported_by_employee.person_id,
        reported_to_id: reported_to_employee.person_id
      }
    }
  end

  def invalid_attributes
    {
      incident_report: { client_id: nil }
    }
  end

  def new_attributes
    attributes_for(:incident_report).slice(:occurred_at, :reported_at, :agency_notified_at, :location)
  end

  describe "GET /index" do
    it "renders a successful response" do
      create(:incident_report)
      get incident_reports_url
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      incident_report = create(:incident_report)
      get incident_report_url(incident_report)
      expect(response).to be_successful
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_incident_report_url
      expect(response).to be_successful
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      incident_report = create(:incident_report)
      get edit_incident_report_url(incident_report)
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new IncidentReport" do
        expect {
          post incident_reports_url, params: valid_attributes
        }.to change(IncidentReport, :count).by(1)
      end

      it "redirects to the created incident_report" do
        post incident_reports_url, params: valid_attributes
        expect(response).to redirect_to(incident_report_url(IncidentReport.last))
      end
    end

    context "with invalid parameters" do
      it "does not create a new IncidentReport" do
        expect {
          post incident_reports_url, params: invalid_attributes
        }.not_to change(IncidentReport, :count)
      end

      it "redirects to new incident_report" do
        post incident_reports_url, params: invalid_attributes
        expect(response).to redirect_to(new_incident_report_path)
      end
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      it "updates the requested incident_report" do
        incident_report = create(:incident_report)
        attrs = new_attributes
        patch incident_report_url(incident_report), params: { incident_report: attrs }
        incident_report.reload
        expect(incident_report.location).to eq(attrs[:location])
        expect(incident_report.occurred_at).to be_within(1.second).of(attrs[:occurred_at])
      end

      it "redirects to the incident_report" do
        incident_report = create(:incident_report)
        patch incident_report_url(incident_report), params: { incident_report: new_attributes }
        incident_report.reload
        expect(response).to redirect_to(incident_report_url(incident_report))
      end
    end

    context "with invalid parameters" do
      it "redirects to edit incident_report" do
        incident_report = create(:incident_report)
        patch incident_report_url(incident_report), params: invalid_attributes
        expect(response).to redirect_to(edit_incident_report_path(incident_report))
      end
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested incident_report" do
      incident_report = create(:incident_report)
      expect {
        delete incident_report_url(incident_report)
      }.to change(IncidentReport, :count).by(-1)
    end

    it "redirects to the incident_reports list" do
      incident_report = create(:incident_report)
      delete incident_report_url(incident_report)
      expect(response).to redirect_to(incident_reports_url)
    end
  end
end
