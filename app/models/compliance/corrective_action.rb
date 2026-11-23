# == Schema Information
#
# Table name: compliance_corrective_actions
#
#  id                 :uuid             not null, primary key
#  closed_at          :datetime
#  description        :text             not null
#  due_on             :date
#  remedy             :text
#  root_cause         :text
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  form_submission_id :uuid             not null
#  incident_report_id :uuid
#
# Indexes
#
#  index_compliance_corrective_actions_on_closed_at           (closed_at)
#  index_compliance_corrective_actions_on_form_submission_id  (form_submission_id)
#  index_compliance_corrective_actions_on_incident_report_id  (incident_report_id)
#
# Foreign Keys
#
#  fk_rails_...  (form_submission_id => compliance_form_submissions.id)
#  fk_rails_...  (incident_report_id => incident_reports.id)
#
module Compliance
  class CorrectiveAction < ApplicationRecord
    self.table_name = "compliance_corrective_actions"

    belongs_to :form_submission, class_name: "Compliance::FormSubmission", inverse_of: :corrective_actions
    belongs_to :incident_report, optional: true

    validates :description, presence: true

    scope :open_actions, -> { where(closed_at: nil) }
    scope :closed_actions, -> { where.not(closed_at: nil) }

    def open?
      closed_at.blank?
    end

    def close!
      update!(closed_at: Time.current)
    end
  end
end
