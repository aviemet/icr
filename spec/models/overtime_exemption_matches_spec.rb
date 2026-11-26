require "rails_helper"

RSpec.describe OvertimeExemption, "#matches?", type: :model do
  it "matches on service_type slug for category criteria" do
    service_type = instance_double(ServiceType, slug: "overnight")
    exemption = described_class.new(
      name: "Overnight OT",
      criteria: [{ "category" => { "operator" => "equals", "value" => "overnight" } }],
    )
    shift = instance_double(Shift, service_type: service_type)

    expect(exemption.matches?(shift)).to be(true)
  end

  it "does not match a different service type slug" do
    service_type = instance_double(ServiceType, slug: "regular-care")
    exemption = described_class.new(
      name: "Overnight OT",
      criteria: [{ "category" => { "operator" => "equals", "value" => "overnight" } }],
    )
    shift = instance_double(Shift, service_type: service_type)

    expect(exemption.matches?(shift)).to be(false)
  end
end
