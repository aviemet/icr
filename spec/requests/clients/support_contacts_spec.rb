require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "/clients/:client_slug/support_contacts" do
  login_user(:admin)

  describe "POST /create" do
    it "creates a support contact for the client" do
      client = create(:client)

      expect {
        post client_support_contacts_url(client), params: {
          support_contact: {
            relationship: "emergency",
            priority: 1,
            is_emergency: true,
            person_attributes: {
              first_name: "Pat",
              last_name: "Lee",
              contact_attributes: {
                phones_attributes: [{ number: "555-0100" }],
              },
            },
          },
        }
      }.to change(Client::SupportContact, :count).by(1)

      expect(response).to redirect_to(client_url(client, tab: "contacts"))
      support_contact = client.support_contacts.last
      expect(support_contact.name).to eq("Pat Lee")
      expect(support_contact.contact.phones.first.number).to eq("555-0100")
    end
  end
end
