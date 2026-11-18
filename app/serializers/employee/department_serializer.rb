# == Schema Information
#
# Table name: departments
#
#  id          :uuid             not null, primary key
#  description :text
#  name        :string           not null
#  slug        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_departments_on_slug  (slug) UNIQUE
#
class Employee::DepartmentSerializer < ApplicationSerializer
  object_as :department, model: "Employee::Department"

  identifier :slug

  attributes(
    :name,
    :description,
  )
end
