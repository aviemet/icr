# == Schema Information
#
# Table name: employees
#
#  id                   :uuid             not null, primary key
#  active_at            :date
#  color                :string
#  eligible_for_hire    :boolean          default(TRUE), not null
#  inactive_at          :date
#  ineligibility_reason :text
#  number               :string
#  slug                 :string           not null
#  status               :integer
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

  identifier :slug

  attributes(
    :number,
    :person_id,
    :active_at,
    :inactive_at,
    :color,
    :status,
  )

  belongs_to :person, serializer: PersonSerializer
  has_one :job_title, serializer: Employee::JobTitleSerializer
end
