# frozen_string_literal: true

require "rails_helper"
require_relative "../support/devise"

RSpec.describe "/reports" do
  login_user(:admin)

  let!(:definition) { create(:report_definition) }

  describe "GET /index" do
    it "renders a successful response" do
      get report_definitions_url
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      get report_definition_url(definition)
      expect(response).to be_successful
    end
  end
end
