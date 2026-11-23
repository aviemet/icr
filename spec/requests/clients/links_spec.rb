require "rails_helper"
require_relative "../../support/devise"

RSpec.describe "/clients/:client_slug/links" do
  login_user(:admin)

  describe "POST /create" do
    it "creates a link for the client" do
      client = create(:client)

      expect {
        post client_links_url(client), params: {
          link: { title: "Care Portal", url: "https://example.com/care" },
        }
      }.to change(Client::Link, :count).by(1)

      expect(response).to redirect_to(client_url(client, tab: "overview"))
      expect(client.links.last.title).to eq("Care Portal")
      expect(client.links.last.url).to eq("https://example.com/care")
    end

    it "creates a link when the url has no scheme" do
      client = create(:client)

      expect {
        post client_links_url(client), params: {
          link: { title: "Google", url: "www.google.com" },
        }
      }.to change(Client::Link, :count).by(1)

      expect(response).to redirect_to(client_url(client, tab: "overview"))
      expect(client.links.last.url).to eq("https://www.google.com")
    end

    it "returns inertia errors when the link is invalid" do
      client = create(:client)

      expect {
        post client_links_url(client), params: {
          link: { title: "", url: "not a url" },
        }
      }.not_to change(Client::Link, :count)

      expect(response).to redirect_to(client_url(client, tab: "overview"))
      expect(session[:inertia_errors]).to be_present
    end

    it "rejects a host without a tld" do
      client = create(:client)

      expect {
        post client_links_url(client), params: {
          link: { title: "Bad", url: "notaurl" },
        }
      }.not_to change(Client::Link, :count)

      expect(session[:inertia_errors]).to be_present
    end
  end

  describe "PATCH /update" do
    it "updates the link" do
      client = create(:client)
      link = create(:client_link, client: client, title: "Old Title")

      patch client_link_url(client, link), params: {
        link: { title: "New Title", url: "https://example.com/updated" },
      }

      expect(response).to redirect_to(client_url(client, tab: "overview"))
      expect(link.reload.title).to eq("New Title")
      expect(link.url).to eq("https://example.com/updated")
    end

    it "normalizes a scheme-less url on update" do
      client = create(:client)
      link = create(:client_link, client: client)

      patch client_link_url(client, link), params: {
        link: { title: link.title, url: "example.org/docs" },
      }

      expect(response).to redirect_to(client_url(client, tab: "overview"))
      expect(link.reload.url).to eq("https://example.org/docs")
    end
  end

  describe "DELETE /destroy" do
    it "destroys the link" do
      client = create(:client)
      link = create(:client_link, client: client)

      expect {
        delete client_link_url(client, link)
      }.to change(Client::Link, :count).by(-1)

      expect(response).to redirect_to(client_url(client, tab: "overview"))
    end
  end
end
