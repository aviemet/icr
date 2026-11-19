# == Schema Information
#
# Table name: job_titles
#
#  id            :uuid             not null, primary key
#  description   :text
#  name          :string           not null
#  slug          :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  department_id :uuid
#
# Indexes
#
#  index_job_titles_on_department_id  (department_id)
#  index_job_titles_on_slug           (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (department_id => departments.id)
#
class Employee::JobTitleSerializer < ApplicationSerializer
  identifier :slug

  attributes(
    :name,
    :description,
    :department_id,
  )

  belongs_to :department, serializer: Employee::DepartmentSerializer
end
