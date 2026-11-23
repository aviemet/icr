require "rails_helper"

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
RSpec.describe Compliance::FormSubmission, type: :model do
  describe "validations" do
    it "requires a household or client" do
      submission = build(:compliance_form_submission, household: nil, client: nil)
      expect(submission).not_to be_valid
      expect(submission.errors[:base]).to include("household or client is required")
    end

    it "requires inspected_on when submitted" do
      submission = build(:compliance_form_submission, :submitted, inspected_on: nil)
      expect(submission).not_to be_valid
      expect(submission.errors[:inspected_on]).to be_present
    end
  end

  describe "#submit!" do
    it "marks the submission submitted with inspected_on" do
      submission = create(:compliance_form_submission, inspected_on: nil)
      submission.submit!
      expect(submission).to be_submitted
      expect(submission.inspected_on).to eq(Date.current)
      expect(submission.submitted_at).to be_present
    end
  end

  describe "answer lockstep with template" do
    it "rejects answers for items outside the submission template" do
      submission = create(:compliance_form_submission)
      other_item = create(:compliance_form_item)
      answer = build(:compliance_form_answer, form_submission: submission, form_item: other_item)

      expect(answer).not_to be_valid
      expect(answer.errors[:form_item_id]).to include("must belong to the submission template")
    end

    it "accepts answers for items on the submission template" do
      submission = create(:compliance_form_submission)
      section = create(:compliance_form_section, form_template: submission.form_template)
      item = create(:compliance_form_item, form_section: section)
      answer = build(:compliance_form_answer, form_submission: submission, form_item: item, check_value: :fail)

      expect(answer).to be_valid
    end
  end
end
