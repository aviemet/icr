# frozen_string_literal: true

require "rails_helper"

RSpec.describe TimeOff::ApproveRequest do
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

  it "approves the request and creates a leave shift" do
    employee = create(:employee, :employed)
    request = create(
      :time_off_request,
      employee: employee,
      kind: :pto,
      hours: 8,
      starts_at: Time.zone.local(2024, 3, 15, 9, 0, 0),
      ends_at: Time.zone.local(2024, 3, 15, 17, 0, 0),
    )

    described_class.call(request: request)

    request.reload
    expect(request).to be_approved
    expect(request.shift).to be_present
    expect(request.shift.service_type.slug).to eq("vacation")
  end
end
