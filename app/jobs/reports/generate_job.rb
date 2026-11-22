# frozen_string_literal: true

class Reports::GenerateJob < ApplicationJob
  queue_as :default

  def perform(report_request_id)
    report_request = ReportRequest.find(report_request_id)
    Reports::Runner.call(report_request)
  end
end
