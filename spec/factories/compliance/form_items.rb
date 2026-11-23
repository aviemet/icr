# == Schema Information
#
# Table name: compliance_form_items
#
#  id              :uuid             not null, primary key
#  key             :string           not null
#  kind            :integer          default("boolean_check"), not null
#  label           :string           not null
#  position        :integer          default(0), not null
#  required        :boolean          default(TRUE), not null
#  show_when       :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  form_section_id :uuid             not null
#
# Indexes
#
#  index_compliance_form_items_on_form_section_id               (form_section_id)
#  index_compliance_form_items_on_form_section_id_and_key       (form_section_id,key) UNIQUE
#  index_compliance_form_items_on_form_section_id_and_position  (form_section_id,position)
#
# Foreign Keys
#
#  fk_rails_...  (form_section_id => compliance_form_sections.id)
#
FactoryBot.define do
  factory :compliance_form_item, class: "Compliance::FormItem" do
    form_section { association :compliance_form_section }
    sequence(:key) { |n| "item_#{n}" }
    sequence(:label) { |n| "Check item #{n}" }
    kind { :boolean_check }
    position { 0 }
    required { true }
    show_when { nil }
  end
end
