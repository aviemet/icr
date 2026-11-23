require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Api::ServiceTypes", type: :request do
  login_user(:admin)

  describe "GET /api/options/service_types" do
    it "returns active service types as options" do
      active = create(:service_type, name: "Active Care #{SecureRandom.hex(4)}", active: true)
      inactive = create(
        :service_type,
        name: "Inactive Care #{SecureRandom.hex(4)}",
        active: false,
        billable: false,
        payable: false,
      )

      get api_service_types_options_path

      expect(response).to have_http_status(:ok)
      ids = response.parsed_body.pluck("id")
      expect(ids).to include(active.id)
      expect(ids).not_to include(inactive.id)
    end
  end
end
