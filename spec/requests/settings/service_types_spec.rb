require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "Settings::ServiceTypes", type: :request do
  login_user(:admin)

  describe "GET /settings/calendar/service_types" do
    it "renders the service types page" do
      create(:service_type, name: "Personal Care #{SecureRandom.hex(4)}")

      get settings_service_types_path

      expect(response).to have_http_status(:ok)
    end
  end

  describe "POST /settings/calendar/service_types" do
    it "creates a custom service type" do
      name = "Community Outing #{SecureRandom.hex(4)}"

      expect {
        post settings_service_types_path, params: {
          service_type: {
            name: name,
            color: "#0B7A75",
            billable: true,
            payable: true,
            allows_multi_client: false,
            requires_notes: true,
            tracks_mileage: true,
            active: true,
          },
        }
      }.to change(ServiceType, :count).by(1)

      expect(response).to redirect_to(settings_service_types_path)
      created = ServiceType.find_by!(name: name)
      expect(created.requires_notes).to be(true)
      expect(created.tracks_mileage).to be(true)
      expect(created.system).to be(false)
    end
  end

  describe "PATCH /settings/calendar/service_types/:slug" do
    it "updates a service type" do
      service_type = create(:service_type, name: "Editable #{SecureRandom.hex(4)}", color: "#2F6FED", assignable: true)

      patch settings_service_type_path(service_type), params: {
        service_type: {
          name: service_type.name,
          color: "#E8590C",
          billable: false,
          payable: true,
          allows_multi_client: true,
          requires_notes: true,
          tracks_mileage: false,
          active: true,
          assignable: false,
        },
      }

      expect(response).to redirect_to(settings_service_types_path)
      service_type.reload
      expect(service_type.color).to eq("#E8590C")
      expect(service_type.billable).to be(false)
      expect(service_type.allows_multi_client).to be(true)
      expect(service_type.requires_notes).to be(true)
      expect(service_type.assignable).to be(false)
    end
  end

  describe "DELETE /settings/calendar/service_types/:slug" do
    it "deletes a custom service type" do
      service_type = create(:service_type, name: "Temp Type #{SecureRandom.hex(4)}")
      slug = service_type.slug

      delete settings_service_type_path(slug)

      expect(response).to redirect_to(settings_service_types_path)
      expect(flash[:alert]).to be_blank
      expect(ServiceType.find_by(slug: slug)).to be_nil
    end

    it "does not delete a system service type" do
      service_type = ServiceType.find_by(slug: "regular") || create(:service_type, :system)

      expect {
        delete settings_service_type_path(service_type)
      }.not_to change(ServiceType, :count)
    end
  end
end
