# frozen_string_literal: true

# == Schema Information
#
# Table name: report_requests
#
#  id                   :uuid             not null, primary key
#  completed_at         :datetime
#  definition_snapshot  :jsonb            not null
#  error_message        :text
#  params               :jsonb            not null
#  status               :string           default("pending"), not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  report_definition_id :uuid             not null
#  requested_by_id      :uuid             not null
#
# Indexes
#
#  index_report_requests_on_completed_at          (completed_at)
#  index_report_requests_on_report_definition_id  (report_definition_id)
#  index_report_requests_on_requested_by_id       (requested_by_id)
#  index_report_requests_on_status                (status)
#
# Foreign Keys
#
#  fk_rails_...  (report_definition_id => report_definitions.id)
#  fk_rails_...  (requested_by_id => users.id)
#
class ReportRequest < ApplicationRecord
  STATUSES = %w[pending processing complete failed].freeze

  resourcify

  belongs_to :report_definition
  belongs_to :requested_by, class_name: "User"
  has_one_attached :file

  validates :status, inclusion: { in: STATUSES }

  scope :expired, -> { where(status: "complete").where(completed_at: ...30.days.ago) }

  def mark_processing!
    update!(status: "processing", error_message: nil)
  end

  def mark_complete!
    update!(status: "complete", completed_at: Time.current, error_message: nil)
  end

  def mark_failed!(message)
    update!(status: "failed", completed_at: Time.current, error_message: message.to_s)
  end
end
