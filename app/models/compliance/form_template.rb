# == Schema Information
#
# Table name: compliance_form_templates
#
#  id           :uuid             not null, primary key
#  active       :boolean          default(TRUE), not null
#  cadence      :integer          default("quarterly"), not null
#  description  :text
#  form_version :integer          default(1), not null
#  name         :string           not null
#  slug         :string           not null
#  subject_type :integer          default("household"), not null
#  system       :boolean          default(FALSE), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_compliance_form_templates_on_active  (active)
#  index_compliance_form_templates_on_slug    (slug) UNIQUE
#
module Compliance
  class FormTemplate < ApplicationRecord
    self.table_name = "compliance_form_templates"

    resourcify

    extend FriendlyId
    friendly_id :name, use: [:slugged, :history]

    enum :cadence, {
      quarterly: 0,
      ad_hoc: 1,
    }

    enum :subject_type, {
      household: 0,
      client: 1,
    }, prefix: :subject

    has_many :form_sections,
             -> { order(:position) },
             class_name: "Compliance::FormSection",
             dependent: :destroy,
             inverse_of: :form_template
    has_many :form_items, through: :form_sections
    has_many :form_submissions,
             class_name: "Compliance::FormSubmission",
             dependent: :restrict_with_exception,
             inverse_of: :form_template

    validates :name, presence: true
    validates :slug, presence: true, uniqueness: true
    validates :form_version, presence: true, numericality: { greater_than: 0 }

    scope :active, -> { where(active: true) }
    scope :includes_associated, -> {
      includes(form_sections: :form_items)
    }

    def cadence_interval
      return 3.months if quarterly?

      nil
    end
  end
end
