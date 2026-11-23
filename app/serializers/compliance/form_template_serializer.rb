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
class Compliance::FormTemplateSerializer < ApplicationSerializer
  object_as :form_template, model: "Compliance::FormTemplate"

  attributes(
    :name,
    :slug,
    :description,
    :form_version,
    :cadence,
    :subject_type,
    :active,
    :system,
  )
end
