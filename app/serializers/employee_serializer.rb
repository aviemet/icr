# == Schema Information
#
# Table name: employees
#
#  id          :bigint           not null, primary key
#  active_at   :date
#  inactive_at :date
#  number      :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  person_id   :bigint           not null
#
# Indexes
#
#  index_employees_on_person_id  (person_id)
#
# Foreign Keys
#
#  fk_rails_...  (person_id => people.id)
#
class EmployeeSerializer < ApplicationSerializer
  object_as :employee

  attributes(
    :number,
    :person_id,
    :active_at,
    :inactive_at,
  )

  belongs_to :person, serializer: PersonSerializer
  has_one :job_title, serializer: JobTitleSerializer
end
