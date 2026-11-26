# frozen_string_literal: true

require "rails_helper"

RSpec.describe ShiftPolicy, type: :policy do
  def stub_shift_for(*clients)
    event = instance_double(Calendar::Event, clients: clients)
    instance_double(Shift, calendar_event: event)
  end

  def stub_facilitator_user(managed_clients:, index: false)
    roles = [[:update, Timesheet]]
    roles << [:index, Timesheet] if index
    employee = instance_double(
      Employee,
      job_title: stub_job_title(roles: roles),
      managed_clients: double(pluck: managed_clients.map(&:id)),
    )
    stub_employee_user(employee: employee)
  end

  permissions :facilitator_approve? do
    it "allows admin" do
      expect(described_class.new(stub_admin_user, stub_shift_for)).to authorize(:facilitator_approve)
    end

    it "allows a caseload facilitator with update and no index" do
      client = instance_double(Client, id: 1)
      user = stub_facilitator_user(managed_clients: [client])
      expect(described_class.new(user, stub_shift_for(client))).to authorize(:facilitator_approve)
    end

    it "denies a facilitator for another caseload client" do
      client = instance_double(Client, id: 1)
      other_client = instance_double(Client, id: 2)
      user = stub_facilitator_user(managed_clients: [client])
      expect(described_class.new(user, stub_shift_for(other_client))).not_to authorize(:facilitator_approve)
    end

    it "denies when a multi-client shift spans another caseload" do
      client = instance_double(Client, id: 1)
      other_client = instance_double(Client, id: 2)
      user = stub_facilitator_user(managed_clients: [client])
      expect(described_class.new(user, stub_shift_for(client, other_client))).not_to authorize(:facilitator_approve)
    end

    it "denies org-wide timesheet index holders" do
      client = instance_double(Client, id: 1)
      user = stub_facilitator_user(managed_clients: [client], index: true)
      expect(described_class.new(user, stub_shift_for(client))).not_to authorize(:facilitator_approve)
    end
  end
end
