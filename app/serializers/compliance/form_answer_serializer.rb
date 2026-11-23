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
class Compliance::FormAnswerSerializer < ApplicationSerializer
  object_as :form_answer, model: "Compliance::FormAnswer"

  attributes(
    :form_submission_id,
    :form_item_id,
    :check_value,
    :text_value,
    :date_value,
  )
end
