# frozen_string_literal: true

require "rails_helper"

RSpec.describe TimeOff::RequestPolicy do
  it "allows the primary manager with approve grant to approve a report request" do
    roles = [
      [:approve, TimeOff::Request],
      [:show, TimeOff::Request],
      [:create, TimeOff::Request],
      [:update, TimeOff::Request],
    ]
    manager = instance_double(Employee, id: 1, job_title: stub_job_title(roles: roles))
    employee = build_stubbed(:employee)
    allow(employee).to receive(:primary_manager_assignment).and_return(double(manager_id: manager.id))
    request = instance_double(TimeOff::Request, employee: employee)
    user = stub_employee_user(employee: manager)
    expect(described_class.new(user, request).approve?).to be(true)
  end

  it "denies approve when the actor is not the primary manager and lacks index" do
    roles = [[:approve, TimeOff::Request], [:show, TimeOff::Request]]
    employee = build_stubbed(:employee)
    allow(employee).to receive(:primary_manager_assignment).and_return(double(manager_id: 1))
    other_employee = instance_double(Employee, id: 2, job_title: stub_job_title(roles: roles))
    request = instance_double(TimeOff::Request, employee: employee)
    user = stub_employee_user(employee: other_employee)
    expect(described_class.new(user, request).approve?).to be(false)
  end
end
