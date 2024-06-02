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

  identifier :slug

  attributes(
    :first_name,
    :middle_name,
    :last_name,
    :person_type,
    :user_id,
    :job_title_id,
  )
end
