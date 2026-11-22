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
class ReportRequestSerializer < ApplicationSerializer
  object_as :report_request

  attributes(
    :status,
    :params,
    :error_message,
    :completed_at,
  )
end
