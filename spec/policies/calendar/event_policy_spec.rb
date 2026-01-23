require "rails_helper"

RSpec.describe Calendar::EventPolicy, type: :policy do
  before do
    @admin_user = create(:user).tap { |u| u.add_role(:admin) }
    @employee = create(:employee, :employed)
    @employee_user = create(:user, person: create(:person, employee: @employee))
    @client = create(:client)
    @client_user = create(:user, person: create(:person, client: @client))
    @events = create_list(:calendar_event, 3)
  end

  describe ".scope" do
    it "returns all events for admin" do
      scope = Pundit.policy_scope(@admin_user, Calendar::Event)
      expect(scope.count).to eq(3)
      expect(scope).to match_array(@events)
    end

    it "returns all events for employee with index permission" do
      job_title = create(:job_title)
      job_title.add_role(:index, Calendar::Event)
      @employee.assign_job_title(job_title)
      @employee.reload

      scope = Pundit.policy_scope(@employee_user, Calendar::Event)
      expect(scope.count).to eq(3)
      expect(scope).to match_array(@events)
    end

    it "returns only events with shifts for employee without permission" do
      event_with_shift = @events.first
      create(:shift, calendar_event: event_with_shift, employee: @employee)

      scope = Pundit.policy_scope(@employee_user, Calendar::Event)
      expect(scope).to include(event_with_shift)
      expect(scope.count).to eq(1)
    end

    it "returns only events where client is participant" do
      event = @events.first
      create(:event_participant, calendar_event: event, participant: @client)

      scope = Pundit.policy_scope(@client_user, Calendar::Event)
      expect(scope).to include(event)
      expect(scope.count).to eq(1)
    end

    it "returns none for user without person" do
      user = create(:user, person: nil)
      scope = Pundit.policy_scope(user, Calendar::Event)
      expect(scope.count).to eq(0)
    end
  end

  permissions :index? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Calendar::Event.new)).to authorize(:index)
    end
  end

  permissions :show? do
    it "allows admin" do
      expect(described_class.new(@admin_user, Calendar::Event.new)).to authorize(:show)
    end
  end
end
