# == Schema Information
#
# Table name: employees
#
#  id                   :uuid             not null, primary key
#  active_at            :date
#  color                :string
#  communication_notes  :text
#  eligible_for_hire    :boolean          default(TRUE), not null
#  inactive_at          :date
#  ineligibility_reason :text
#  number               :string
#  preferred_language   :string
#  slug                 :string           not null
#  status               :integer
#  termination_reason   :text
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  person_id            :uuid             not null
#
# Indexes
#
#  index_employees_on_person_id  (person_id)
#  index_employees_on_slug       (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#
class EmployeeSerializer < ApplicationSerializer
  include PersonFields
  include ColorMappingFields

  object_as :employee

  identifier :slug

  attributes(
    :number,
    :person_id,
    :active_at,
    :inactive_at,
    :color,
    :status,
    :preferred_language,
    :communication_notes,
    :eligible_for_hire,
    :termination_reason,
    :ineligibility_reason,
  )

  belongs_to :person, serializer: PersonSerializer
  has_one :job_title, serializer: Employee::JobTitleSerializer
end
