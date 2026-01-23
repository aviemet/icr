require "rails_helper"

RSpec.describe IncidentReportPolicy, type: :policy do
  before do
    @admin_user = create(:user).tap { |u| u.add_role(:admin) }
    @employee = create(:employee, :employed)
    @employee_user = create(:user, person: create(:person, employee: @employee))
    @client = create(:client)
    @client_user = create(:user, person: create(:person, client: @client))
  end

  describe ".scope" do
    it "returns all incident reports for admin" do
      create_list(:incident_report, 3)
      scope = Pundit.policy_scope(@admin_user, IncidentReport)
      expect(scope.count).to eq(3)
    end

    it "returns all incident reports for employee with index permission" do
      job_title = create(:job_title)
      job_title.add_role(:index, IncidentReport)
      @employee.assign_job_title(job_title)
      @employee.reload

      create_list(:incident_report, 3)
      scope = Pundit.policy_scope(@employee_user, IncidentReport)
      expect(scope.count).to eq(3)
    end

    it "returns only reports where employee is reported_by or reported_to" do
      report_by = create(:incident_report, reported_by_employee: @employee)
      report_to = create(:incident_report, reported_to_employee: @employee)
      other_report = create(:incident_report)

      scope = Pundit.policy_scope(@employee_user, IncidentReport)
      expect(scope).to include(report_by)
      expect(scope).to include(report_to)
      expect(scope).not_to include(other_report)
    end

    it "returns only reports for client" do
      report = create(:incident_report, client: @client)
      other_report = create(:incident_report)

      scope = Pundit.policy_scope(@client_user, IncidentReport)
      expect(scope).to include(report)
      expect(scope).not_to include(other_report)
    end

    it "returns none for user without person" do
      user = create(:user, person: nil)
      create_list(:incident_report, 3)
      scope = Pundit.policy_scope(user, IncidentReport)
      expect(scope.count).to eq(0)
    end
  end

  permissions :index? do
    it "allows admin" do
      expect(described_class.new(@admin_user, IncidentReport.new)).to authorize(:index)
    end
  end

  permissions :show? do
    it "allows admin" do
      expect(described_class.new(@admin_user, IncidentReport.new)).to authorize(:show)
    end
  end
end
