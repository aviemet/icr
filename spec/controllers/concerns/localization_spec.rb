require "rails_helper"

RSpec.describe Localization, type: :controller do
  controller(ApplicationController) do
    def index
      render plain: "Current time: #{Time.current}"
    end
  end

  before do
    routes.draw { get "index" => "anonymous#index" }
  end

  describe "locale handling" do
    it "sets locale from params" do
      user = create(:user)
      sign_in user

      get :index, params: { locale: "es" }
      expect(I18n.locale).to eq(:es)
    end

    it "falls back to default locale for invalid locale" do
      user = create(:user)
      sign_in user

      get :index, params: { locale: "invalid" }
      expect(I18n.locale).to eq(I18n.default_locale)
    end
  end

  describe "timezone handling" do
    it "uses user timezone" do
      user = create(:user, time_zone: "Pacific Time (US & Canada)")
      sign_in user

      get :index
      expect(Time.zone.name).to eq("Pacific Time (US & Canada)")
    end
  end
end
