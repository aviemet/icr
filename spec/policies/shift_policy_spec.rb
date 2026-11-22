# frozen_string_literal: true

require "rails_helper"

RSpec.describe ShiftPolicy, type: :policy do
  def build_shift_for(client:, employee: nil)
    attendant = employee || create(:employee, :employed)
    event = create(
      :calendar_event,
      starts_at: 1.day.ago.change(hour: 9),
      ends_at: 1.day.ago.change(hour: 17),
    )
    event.event_participants.create!(participant: client)
    create(:shift, employee: attendant, calendar_event: event)
  end

  before do
    @admin_user = create(:user).tap { |user| user.add_role(:admin) }
    @job_title = create(:job_title)
    @facilitator = create(:employee, :employed)
    @facilitator.assign_job_title(@job_title)
    @facilitator.reload
    @facilitator_user = create(:user, person: create(:person, employee: @facilitator))
    @client = create(:client)
    @other_client = create(:client)
  end

  permissions :facilitator_approve? do
    it "allows admin" do
      shift = build_shift_for(client: @client)

      expect(described_class.new(@admin_user, shift)).to authorize(:facilitator_approve)
    end

    it "allows a caseload facilitator with update and no index" do
      @job_title.add_role(:update, Timesheet)
      @facilitator.reload
      create(:clients_manager, manager: @facilitator, client: @client, starts_at: 1.week.ago)
      shift = build_shift_for(client: @client)

      expect(described_class.new(@facilitator_user, shift)).to authorize(:facilitator_approve)
    end

    it "denies a facilitator for another caseload client" do
      @job_title.add_role(:update, Timesheet)
      @facilitator.reload
      create(:clients_manager, manager: @facilitator, client: @client, starts_at: 1.week.ago)
      shift = build_shift_for(client: @other_client)

      expect(described_class.new(@facilitator_user, shift)).not_to authorize(:facilitator_approve)
    end

    it "denies when a multi-client shift spans another caseload" do
      @job_title.add_role(:update, Timesheet)
      @facilitator.reload
      create(:clients_manager, manager: @facilitator, client: @client, starts_at: 1.week.ago)
      attendant = create(:employee, :employed)
      event = create(
        :calendar_event,
        starts_at: 1.day.ago.change(hour: 9),
        ends_at: 1.day.ago.change(hour: 17),
      )
      event.event_participants.create!(participant: @client)
      event.event_participants.create!(participant: @other_client)
      shift = create(:shift, employee: attendant, calendar_event: event)

      expect(described_class.new(@facilitator_user, shift)).not_to authorize(:facilitator_approve)
    end

    it "denies org-wide timesheet index holders" do
      @job_title.add_role(:update, Timesheet)
      @job_title.add_role(:index, Timesheet)
      @facilitator.reload
      create(:clients_manager, manager: @facilitator, client: @client, starts_at: 1.week.ago)
      shift = build_shift_for(client: @client)

      expect(described_class.new(@facilitator_user, shift)).not_to authorize(:facilitator_approve)
    end
  end
end
