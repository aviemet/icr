require "rails_helper"

RSpec.describe "Login page", type: :request do
  it "embeds the Inertia page payload in a JSON script tag" do
    get "/login"

    expect(response).to be_successful
    expect(response.body).to include('type="application/json"')
    expect(response.body).to include("data-page")
    expect(response.body).to include("Devise/Login")
    expect(response.body).not_to include('id="app" data-page=')
  end
end
