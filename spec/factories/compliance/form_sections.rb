# == Schema Information
#
# Table name: compliance_form_sections
#
#  id               :uuid             not null, primary key
#  key              :string           not null
#  name             :string           not null
#  position         :integer          default(0), not null
#  show_when        :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  form_template_id :uuid             not null
#
# Indexes
#
#  idx_on_form_template_id_position_4ed1c1dca9                 (form_template_id,position)
#  index_compliance_form_sections_on_form_template_id          (form_template_id)
#  index_compliance_form_sections_on_form_template_id_and_key  (form_template_id,key) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (form_template_id => compliance_form_templates.id)
#
FactoryBot.define do
  factory :compliance_form_section, class: "Compliance::FormSection" do
    form_template { association :compliance_form_template }
    sequence(:name) { |n| "Section #{n}" }
    sequence(:key) { |n| "section_#{n}" }
    position { 0 }
    show_when { nil }
  end
end
