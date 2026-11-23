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
module Compliance
  class FormSection < ApplicationRecord
    self.table_name = "compliance_form_sections"

    belongs_to :form_template, class_name: "Compliance::FormTemplate", inverse_of: :form_sections

    has_many :form_items,
             -> { order(:position) },
             class_name: "Compliance::FormItem",
             dependent: :destroy,
             inverse_of: :form_section

    validates :name, presence: true
    validates :key, presence: true, uniqueness: { scope: :form_template_id }
    validates :position, presence: true

    scope :in_order, -> { order(:position) }
  end
end
