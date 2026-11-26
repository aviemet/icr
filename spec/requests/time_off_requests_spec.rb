# frozen_string_literal: true

require "rails_helper"

RSpec.describe "TimeOffRequests", type: :request do
  before do
    Category.type("Calendar::Event").find_or_create_by!(name: "Shift") { |category| category.system = true }
    %w[vacation sick].each do |slug|
      ServiceType.find_or_create_by!(slug: slug) do |service_type|
        service_type.name = slug.capitalize
        service_type.system = true
        service_type.billable = false
        service_type.payable = true
        service_type.color = "#B45309"
        service_type.position = 0
      end
    end
  end

  it "lets an employee submit a time off request" do
    job_title = create(:job_title)
    job_title.add_role(:create, TimeOff::Request)
    job_title.add_role(:show, TimeOff::Request)
    job_title.add_role(:update, TimeOff::Request)
    employee = create(:employee, :employed)
    employee.assign_job_title(job_title)
    user = create(:user, person: employee.person)
    sign_in user

    expect {
      post time_off_requests_path, params: {
        time_off_request: {
          kind: "pto",
          starts_at: 1.week.from_now.change(hour: 9).iso8601,
          ends_at: 1.week.from_now.change(hour: 17).iso8601,
          hours: 8,
        },
      }
    }.to change(TimeOff::Request, :count).by(1)

    expect(response).to redirect_to(time_off_requests_path)
    expect(TimeOff::Request.last).to be_pending
  end

  it "lets a primary manager approve a pending request" do
    job_title = create(:job_title)
    job_title.add_role(:approve, TimeOff::Request)
    job_title.add_role(:show, TimeOff::Request)
    manager = create(:employee, :employed)
    manager.assign_job_title(job_title)
    report = create(:employee, :employed)
    create(:employees_manager, employee: report, manager: manager, primary: true)
    request = create(
      :time_off_request,
      employee: report,
      kind: :pto,
      hours: 8,
      starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0),
      ends_at: Time.zone.local(2024, 3, 15, 17, 0, 0),
    )
    user = create(:user, person: manager.person)
    sign_in user

    post approve_time_off_request_path(request)

    expect(response).to redirect_to(time_off_requests_path)
    expect(request.reload).to be_approved
    expect(request.shift).to be_present
  end

  it "shows each pending request once for an org-index approver who is also a primary manager" do
    job_title = create(:job_title)
    job_title.add_role(:approve, TimeOff::Request)
    job_title.add_role(:index, TimeOff::Request)
    job_title.add_role(:show, TimeOff::Request)
    job_title.add_role(:create, TimeOff::Request)
    manager = create(:employee, :employed)
    manager.assign_job_title(job_title)
    report = create(:employee, :employed)
    create(:employees_manager, employee: report, manager: manager, primary: true)
    create(
      :time_off_request,
      employee: report,
      kind: :pto,
      hours: 8,
      starts_at: 1.week.from_now.change(hour: 9),
      ends_at: 1.week.from_now.change(hour: 17),
      status: :pending,
    )
    other = create(
      :time_off_request,
      employee: create(:employee, :employed),
      kind: :sick,
      hours: 4,
      starts_at: 2.weeks.from_now.change(hour: 9),
      ends_at: 2.weeks.from_now.change(hour: 13),
      status: :pending,
    )
    user = create(:user, person: manager.person)
    sign_in user

    get time_off_requests_path

    expect(response).to be_successful
    props = inertia.props.deep_symbolize_keys
    pending_ids = props.fetch(:pending_queue).map { |row| row.fetch(:id).to_s }
    org_ids = props.fetch(:org_pending).map { |row| row.fetch(:id).to_s }
    report_request_id = TimeOff::Request.find_by!(employee: report).id.to_s

    expect(pending_ids).to include(report_request_id)
    expect(org_ids).to include(other.id.to_s)
    expect(org_ids).not_to include(report_request_id)
    expect(pending_ids & org_ids).to be_empty
  end
end
