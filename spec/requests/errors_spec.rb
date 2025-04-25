require "rails_helper"

RSpec.describe "Errors", type: :request do
  login_user(:admin)

  it "renders the error page" do
    get "/error/404"
    expect(response).to be_successful
  end
end
