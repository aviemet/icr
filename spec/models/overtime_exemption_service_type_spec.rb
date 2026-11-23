require "rails_helper"

RSpec.describe OvertimeExemption, "service type matching", type: :model do
  it "matches on service_type slug for category criteria" do
    service_type = ServiceType.find_or_create_by!(name: "Overnight") do |row|
      row.color = "#15803D"
      row.billable = true
      row.payable = true
    end
    exemption = described_class.create!(
      name: "Overnight OT #{SecureRandom.hex(4)}",
      criteria: [{ "category" => { "operator" => "equals", "value" => service_type.slug } }],
    )
    shift = create(:shift, service_type: service_type)

    expect(exemption.matches?(shift)).to be(true)
  end

  it "does not match a different service type slug" do
    overnight = ServiceType.find_or_create_by!(name: "Overnight") do |row|
      row.color = "#15803D"
      row.billable = true
      row.payable = true
    end
    service_type = create(:service_type, name: "Regular Care #{SecureRandom.hex(4)}")
    exemption = described_class.create!(
      name: "Overnight OT #{SecureRandom.hex(4)}",
      criteria: [{ "category" => { "operator" => "equals", "value" => overnight.slug } }],
    )
    shift = create(:shift, service_type: service_type)

    expect(exemption.matches?(shift)).to be(false)
  end
end
