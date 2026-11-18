# frozen_string_literal: true

module Payroll
  class ApplyAdjustment
    def self.call(timesheet, change_set)
      new(timesheet, change_set).call
    end

    def initialize(timesheet, change_set)
      @timesheet = timesheet
      @change_set = change_set
    end

    def call
      return if @timesheet.nil?

      attrs = {}
      if @change_set.key?("approved_at")
        attrs[:approved_at] = @change_set["approved_at"].presence
      end
      if @change_set.key?("total_regular_hours")
        attrs[:total_regular_hours] = @change_set["total_regular_hours"]
      end
      if @change_set.key?("total_ot_hours")
        attrs[:total_ot_hours] = @change_set["total_ot_hours"]
      end
      @timesheet.update!(attrs) if attrs.present?
    end
  end
end
