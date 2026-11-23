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
FactoryBot.define do
  factory :compliance_corrective_action, class: "Compliance::CorrectiveAction" do
    form_submission { association :compliance_form_submission }
    description { "Unsafe condition identified" }
    root_cause { "Root cause" }
    remedy { "Corrective action" }
    due_on { Date.current + 7.days }
    closed_at { nil }
    incident_report { nil }
  end
end
