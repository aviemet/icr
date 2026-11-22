# frozen_string_literal: true

class Reports::PurgeExpiredJob < ApplicationJob
  queue_as :default

  def perform
    ReportRequest.expired.find_each(&:destroy!)
  end
end
