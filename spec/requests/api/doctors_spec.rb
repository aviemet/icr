require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "/api/options/doctors" do
  login_user(:admin)

  it "returns doctor options" do
    doctor = create(:doctor)

    get api_doctors_options_url

    expect(response).to have_http_status(:ok)
    payload = response.parsed_body
    expect(payload.pluck("id")).to include(doctor.id)
  end
end
