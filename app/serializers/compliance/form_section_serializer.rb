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
class Compliance::FormSectionSerializer < ApplicationSerializer
  object_as :form_section, model: "Compliance::FormSection"

  attributes(
    :form_template_id,
    :name,
    :key,
    :position,
    :show_when,
  )
end
