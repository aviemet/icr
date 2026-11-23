# == Schema Information
#
# Table name: compliance_form_submissions
#
#  id               :uuid             not null, primary key
#  closed_at        :datetime
#  due_on           :date
#  inspected_on     :date
#  started_via      :integer          default("manual"), not null
#  status           :integer          default("draft"), not null
#  submitted_at     :datetime
#  template_version :integer          default(1), not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  client_id        :uuid
#  conducted_by_id  :uuid
#  form_template_id :uuid             not null
#  household_id     :uuid
#
# Indexes
#
#  idx_on_form_template_id_client_id_status_362b89fc42     (form_template_id,client_id,status)
#  idx_on_form_template_id_household_id_status_cf1550f51b  (form_template_id,household_id,status)
#  index_compliance_form_submissions_on_client_id          (client_id)
#  index_compliance_form_submissions_on_conducted_by_id    (conducted_by_id)
#  index_compliance_form_submissions_on_due_on             (due_on)
#  index_compliance_form_submissions_on_form_template_id   (form_template_id)
#  index_compliance_form_submissions_on_household_id       (household_id)
#  index_compliance_form_submissions_on_status             (status)
#
# Foreign Keys
#
#  fk_rails_...  (client_id => clients.id)
#  fk_rails_...  (conducted_by_id => employees.id)
#  fk_rails_...  (form_template_id => compliance_form_templates.id)
#  fk_rails_...  (household_id => households.id)
#
class Compliance::FormSubmissionSerializer < ApplicationSerializer
  object_as :form_submission, model: "Compliance::FormSubmission"

  attributes(
    :form_template_id,
    :household_id,
    :client_id,
    :conducted_by_id,
    :inspected_on,
    :due_on,
    :status,
    :started_via,
    :template_version,
    :submitted_at,
    :closed_at,
  )
end
