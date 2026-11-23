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
FactoryBot.define do
  factory :compliance_form_template, class: "Compliance::FormTemplate" do
    sequence(:name) { |n| "Compliance Form #{n}" }
    sequence(:slug) { |n| "compliance-form-#{n}" }
    description { "Inspection template" }
    form_version { 1 }
    cadence { :quarterly }
    subject_type { :household }
    active { true }
    system { false }

    trait :hazard_assessment do
      name { "Hazard Assessment and Correction Record" }
      slug { Compliance::HazardAssessmentSeed::TEMPLATE_SLUG }
      system { true }
    end

    trait :with_section do
      after(:create) do |template|
        section = create(:compliance_form_section, form_template: template)
        create(:compliance_form_item, form_section: section)
      end
    end
  end
end
