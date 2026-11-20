# == Schema Information
#
# Table name: employees
#
#  id                            :uuid             not null, primary key
#  active_at                     :date
#  application_source            :string
#  color                         :string
#  communication_notes           :text
#  desired_compensation_cents    :integer
#  desired_compensation_currency :string           default("USD"), not null
#  desired_compensation_period   :integer
#  eligible_for_hire             :boolean          default(TRUE), not null
#  hiring_notes                  :text
#  inactive_at                   :datetime
#  ineligibility_reason          :text
#  number                        :string
#  preferred_language            :string
#  slug                          :string           not null
#  status                        :integer
#  termination_reason            :text
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#  desired_job_title_id          :uuid
#  person_id                     :uuid             not null
#
# Indexes
#
#  index_employees_on_desired_job_title_id  (desired_job_title_id)
#  index_employees_on_person_id             (person_id)
#  index_employees_on_slug                  (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (desired_job_title_id => job_titles.id)
#  fk_rails_...  (person_id => people.id)
#
FactoryBot.define do
  factory :employee do
    active_at { Faker::Date.backward(days: 30) }
    number { Faker::Alphanumeric.alpha(number: 8).upcase }
    status { :applicant }
    eligible_for_hire { true }

    person factory: %i[person_with_contacts]

    # Traits Example Usage:
    # build(:employee) -> applicant
    # build(:employee, :offered) -> offered employee (in memory)
    # create(:employee, :employed) -> employed employee (persisted)
    # create(:employee, :terminated, inactive_at: Date.new(2024, 1, 1)) -> terminated on specific date
    # build_stubbed(:employee, :employed) -> stubbed employed employee

    # You can still combine traits with overrides:
    # build(:employee, :employed, active_at: Date.new(2022, 6, 1))

    trait :offered do
      after(:create) do |employee|
        employee.make_offer! if employee.may_make_offer?
      end
    end

    trait :employed do
      after(:create) do |employee|
        employee.make_offer! if employee.may_make_offer?
        employee.accept_offer! if employee.may_accept_offer?
      end
    end

    trait :declined do
      after(:create) do |employee|
        employee.make_offer! if employee.may_make_offer?
        employee.reject_offer! if employee.may_reject_offer?
      end
    end

    trait :terminated do
      transient do
        termination_date { Time.zone.now }
      end

      after(:create) do |employee, evaluator|
        employee.make_offer! if employee.may_make_offer?
        employee.accept_offer! if employee.may_accept_offer?
        employee.assign_attributes(
          termination_reason: "Factory termination",
          inactive_at: evaluator.termination_date,
        )
        employee.terminate! if employee.may_terminate?
      end
    end

    trait :withdrawn do
      after(:create) do |employee|
        employee.assign_attributes(ineligibility_reason: "Factory withdrawal")
        employee.withdraw_application! if employee.may_withdraw_application?
      end
    end

    trait :ineligible do
      eligible_for_hire { false }
      ineligibility_reason { "Marked ineligible by factory trait." }
    end
  end
end
