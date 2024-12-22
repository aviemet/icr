require "rails_helper"
require_relative "../support/devise"

RSpec.describe "/clients", :inertia do
  def valid_attributes
    {
      client: {
        **attributes_for(:client),
        person_attributes: attributes_for(:person)
      }
    }
  end

  def invalid_attributes
    {
      client: { person_id: nil }
    }
  end

  describe "GET /index" do
    login_user(:admin)

    it "lists all clients" do
      clients = create_list(:client, 2)

      get clients_url

      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component "Clients/Index"
      expect(response.body).to include(CGI.escapeHTML(clients[0].person.first_name), CGI.escapeHTML(clients[1].person.first_name))
    end

    context "with search params" do
      it "lists only clients matching search params" do
        clients = create_list(:client, 2)

        get clients_url, params: { search: clients[0].person.first_name.downcase }

        expect(response).to have_http_status(:ok)
        expect_inertia.to render_component "Clients/Index"
        expect(response.body).to include(CGI.escapeHTML(clients[0].person.first_name))
        expect(response.body).not_to include(CGI.escapeHTML(clients[1].person.first_name))
      end
    end
  end

  describe "GET /show" do
    login_user(:admin)

    it "renders a successful response" do
      client = create(:client)

      get client_url(client)

      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component "Clients/Show"
    end
  end

  describe "GET /new" do
    login_user(:admin)

    it "renders a successful response" do
      get new_client_url

      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component "Clients/New"
    end
  end

  describe "GET /edit" do
    login_user(:admin)

    it "renders a successful response" do
      client = create(:client)

      get edit_client_url(client)

      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component "Clients/Edit"
    end
  end

  describe "POST /create" do
    login_user(:admin)

    context "with valid parameters" do
      it "creates a new Client" do
        expect {
          post clients_url, params: valid_attributes
        }.to change(Client, :count).by(1)
      end

      it "redirects to the created client" do
        post clients_url, params: valid_attributes

        expect(response).to redirect_to(client_url(Client.last))
      end
    end

    context "with invalid parameters" do
      it "does not create a new Client" do
        expect {
          post clients_url, params: invalid_attributes
        }.not_to change(Client, :count)
      end

      it "redirects back to the new client page" do
        post clients_url, params: invalid_attributes
        expect(response).to redirect_to(new_client_url)
      end

    end
  end

  describe "PATCH /update" do
    login_user(:admin)

    context "with valid parameters" do
      it "updates the requested client" do
        client = create(:client)

        patch client_url(client), params: { client: { number: "changed"} }
        client.reload

        expect(client.number).to eq("changed")
      end

      it "redirects to the client" do
        client = create(:client)

        patch client_url(client), params: { client: { number: "changed"} }
        client.reload

        expect(response).to redirect_to(client_url(client))
      end
    end

    context "with invalid parameters" do
      it "redirects back to the edit client page" do
        client = create(:client)

        patch client_url(client), params: invalid_attributes

        expect(response).to redirect_to(edit_client_url(client))
      end

    end
  end

  describe "DELETE /destroy" do
    login_user(:admin)

    it "destroys the requested client" do
      client = create(:client)
      expect {
        delete client_url(client)
      }.to change(Client, :count).by(-1)
    end

    it "redirects to the clients list" do
      client = create(:client)
      delete client_url(client)
      expect(response).to redirect_to(clients_url)
    end
  end
end
