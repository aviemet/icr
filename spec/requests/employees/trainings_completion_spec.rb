require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Employee training completion gating" do
  let(:target_employee) { create(:employee, :employed) }
  let(:training) { create(:training) }
  let!(:assignment) do
    create(
      :employees_training,
      employee: target_employee,
      training: training,
      started_at: 1.day.ago,
      completed_at: nil,
    )
  end

  def sign_in_with_title(name:, complete: false)
    title = create(:job_title, name: name)
    title.add_role(:index, Employee)
    title.add_role(:show, Employee)
    title.add_role(:update, Employee)
    title.add_role(:complete, Employee::Training) if complete
    actor = create(:employee, :employed)
    actor.assign_job_title(title)
    actor.reload
    user = create(:user, person: actor.person)
    user.confirm
    sign_in user
    user
  end

  it "allows a title with complete grant to mark complete" do
    sign_in_with_title(name: "Facilitator", complete: true)

    put employee_training_url(target_employee, assignment), params: {
      employees_training: { completed_at: Time.current.iso8601 },
    }

    expect(response).to redirect_to(employee_url(target_employee, tab: "trainings"))
    expect(assignment.reload.completed_at).to be_present
  end

  it "forbids an Attendant with employee update from marking complete" do
    sign_in_with_title(name: "Attendant")

    put employee_training_url(target_employee, assignment), params: {
      employees_training: { completed_at: Time.current.iso8601 },
    }

    expect(response).to have_http_status(:redirect).or have_http_status(:forbidden)
    expect(assignment.reload.completed_at).to be_nil
  end

  it "allows an Attendant with employee update to edit started_at only" do
    sign_in_with_title(name: "Attendant")
    started = 2.days.ago.iso8601

    put employee_training_url(target_employee, assignment), params: {
      employees_training: { started_at: started },
    }

    expect(response).to redirect_to(employee_url(target_employee, tab: "trainings"))
    expect(assignment.reload.started_at).to be_within(1.second).of(Time.zone.parse(started))
    expect(assignment.completed_at).to be_nil
  end
end
