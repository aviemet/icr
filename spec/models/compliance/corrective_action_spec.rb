require "rails_helper"

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
RSpec.describe Compliance::CorrectiveAction, type: :model do
  it "closes an open action" do
    action = create(:compliance_corrective_action)
    expect(action).to be_open
    action.close!
    expect(action).not_to be_open
    expect(action.closed_at).to be_present
  end

  it "can link an incident report" do
    incident = create(:incident_report)
    action = create(:compliance_corrective_action, incident_report: incident)
    expect(action.incident_report).to eq(incident)
  end
end
