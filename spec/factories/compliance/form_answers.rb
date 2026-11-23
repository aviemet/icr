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
FactoryBot.define do
  factory :compliance_form_answer, class: "Compliance::FormAnswer" do
    form_submission { association :compliance_form_submission }
    form_item do
      association :compliance_form_item,
                  form_section: association(
                    :compliance_form_section,
                    form_template: form_submission.form_template,
                  )
    end
    check_value { :pass }
  end
end
