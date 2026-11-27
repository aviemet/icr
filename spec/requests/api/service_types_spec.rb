require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Api::ServiceTypes", type: :request do
  login_user(:admin)

  describe "GET /api/options/service_types" do
    it "returns active assignable service types ordered by position" do
      earlier = create(
        :service_type,
        name: "Earlier Work #{SecureRandom.hex(4)}",
        active: true,
        assignable: true,
        position: 10,
      )
      later = create(
        :service_type,
        name: "Later Work #{SecureRandom.hex(4)}",
        active: true,
        assignable: true,
        position: 20,
      )
      inactive = create(
        :service_type,
        name: "Inactive Care #{SecureRandom.hex(4)}",
        active: false,
        billable: false,
        payable: false,
      )
      not_assignable = create(
        :service_type,
        name: "Leave Code #{SecureRandom.hex(4)}",
        active: true,
        assignable: false,
        position: 15,
      )

      get api_service_types_options_path

      expect(response).to have_http_status(:ok)
      ids = response.parsed_body.pluck("id")
      expect(ids).to include(earlier.id, later.id)
      expect(ids).not_to include(inactive.id)
      expect(ids).not_to include(not_assignable.id)
      expect(ids.index(earlier.id)).to be < ids.index(later.id)
    end
  end
end
