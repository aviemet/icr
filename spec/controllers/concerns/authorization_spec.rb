require "rails_helper"

RSpec.describe Authorization, type: :controller do
  controller(ApplicationController) do
    def index
      authorize :dashboard, :show?
      render plain: "OK"
    end
  end

  before do
    routes.draw { get "index" => "anonymous#index" }
  end

  describe "authorization" do
    it "handles unauthorized access" do
      user = create(:user)
      sign_in user

      get :index

      expect(flash[:warning]).to be_present
      expect(response).to redirect_to(root_path)
    end
  end
end
