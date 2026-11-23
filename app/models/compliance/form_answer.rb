# == Schema Information
#
# Table name: compliance_form_answers
#
#  id                 :uuid             not null, primary key
#  check_value        :integer
#  date_value         :date
#  text_value         :text
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  form_item_id       :uuid             not null
#  form_submission_id :uuid             not null
#
# Indexes
#
#  index_compliance_form_answers_on_form_item_id         (form_item_id)
#  index_compliance_form_answers_on_form_submission_id   (form_submission_id)
#  index_compliance_form_answers_on_submission_and_item  (form_submission_id,form_item_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (form_item_id => compliance_form_items.id)
#  fk_rails_...  (form_submission_id => compliance_form_submissions.id)
#
module Compliance
  class FormAnswer < ApplicationRecord
    self.table_name = "compliance_form_answers"

    belongs_to :form_submission, class_name: "Compliance::FormSubmission", inverse_of: :form_answers
    belongs_to :form_item, class_name: "Compliance::FormItem", inverse_of: :form_answers

    enum :check_value, {
      pass: 0,
      fail: 1,
      na: 2,
    }, prefix: true

    validate :value_matches_item_kind
    validate :item_belongs_to_submission_template

    private

    def value_matches_item_kind
      return if form_item.blank?
      return unless form_submission&.submitted? || form_submission&.closed?
      return unless form_item.required?

      case form_item.kind
      when "boolean_check", "gate"
        errors.add(:check_value, "must be present") if check_value.blank?
      when "text"
        errors.add(:text_value, "must be present") if text_value.blank?
      when "date"
        errors.add(:date_value, "must be present") if date_value.blank?
      end
    end

    def item_belongs_to_submission_template
      return if form_item.blank? || form_submission.blank?
      return if form_item.form_template.id == form_submission.form_template_id

      errors.add(:form_item_id, "must belong to the submission template")
    end
  end
end
