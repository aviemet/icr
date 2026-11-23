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
module Compliance
  class FormItem < ApplicationRecord
    self.table_name = "compliance_form_items"

    belongs_to :form_section, class_name: "Compliance::FormSection", inverse_of: :form_items

    has_many :form_answers,
             class_name: "Compliance::FormAnswer",
             dependent: :restrict_with_exception,
             inverse_of: :form_item

    enum :kind, {
      boolean_check: 0,
      text: 1,
      date: 2,
      gate: 3,
    }

    validates :key, presence: true, uniqueness: { scope: :form_section_id }
    validates :label, presence: true
    validates :position, presence: true

    scope :in_order, -> { order(:position) }

    delegate :form_template, to: :form_section
  end
end
