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
class Compliance::FormItemSerializer < ApplicationSerializer
  object_as :form_item, model: "Compliance::FormItem"

  attributes(
    :form_section_id,
    :key,
    :label,
    :kind,
    :position,
    :required,
    :show_when,
  )
end
