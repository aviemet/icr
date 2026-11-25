require "rails_helper"

RSpec.describe Catalog::RegionalCentersSeed do
  it "upserts regional centers from the committed snapshot with contact details" do
    described_class.call

    expect(RegionalCenter.count).to be >= 21

    east_bay = RegionalCenter.find_by!(code: "rceb")
    expect(east_bay.name).to eq("Regional Center of the East Bay")
    expect(east_bay.contact).to be_present
    expect(east_bay.websites.map(&:url)).to include("https://www.rceb.org")
    expect(east_bay.addresses.first&.city).to eq("San Leandro")

    expect {
      described_class.call
    }.not_to change(RegionalCenter, :count)
  end
end
