require "rails_helper"

RSpec.describe Authentication, type: :controller do
  controller(ApplicationController) do
    def index
      render plain: "OK"
    end
  end

  describe "authentication" do
    before do
      routes.draw { get "index" => "anonymous#index" }
    end

    it "redirects to login when user is not authenticated" do
      get :index
      expect(response).to redirect_to(new_user_session_path)
    end

    it "allows access when user is authenticated" do
      user = create(:user)
      sign_in user
      get :index
      expect(response).to have_http_content_type(:text)
      expect(response.body).to eq("OK")
    end
  end
end
