# frozen_string_literal: true

require "rails_helper"
require_relative "../support/devise"

RSpec.describe "/report_requests" do
  include ActiveJob::TestHelper

  login_user(:admin)

  let!(:definition) { create(:report_definition) }

  describe "GET /index" do
    it "renders a successful response" do
      create(:report_request, report_definition: definition, requested_by: @user)
      get report_requests_url
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    it "enqueues a report request and redirects to the queue" do
      ActiveJob::Base.queue_adapter = :test

      post report_requests_url, params: {
        report_definition_id: definition.id,
        report_request: { within_days: 21, include_expired: true },
      }

      expect(response).to redirect_to(report_requests_url)
      request = ReportRequest.last
      expect(request.params["within_days"]).to eq("21")
      expect(Reports::GenerateJob).to have_been_enqueued.with(request.id)
    end
  end
end
