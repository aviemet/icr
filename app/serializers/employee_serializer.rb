# == Schema Information
#
# Table name: employees
#
#  id          :uuid             not null, primary key
#  active_at   :date
#  color       :string
#  inactive_at :date
#  number      :string
#  slug        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  person_id   :uuid             not null
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
  object_as :employee

  identifier :slug

  attributes(
    :number,
    :person_id,
    :active_at,
    :inactive_at,
  )

  belongs_to :person, serializer: PersonSerializer
  has_one :job_title, serializer: JobTitleSerializer
end
