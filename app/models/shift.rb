class Shift < ApplicationRecord
	has_and_belongs_to_many :clients, class_name: 'Person'
  belongs_to :employee
	belongs_to :created_by, class_name: 'User'

	accepts_nested_attributes_for :clients

	def title
		"#{starts_at.strftime("%-I %p")} - #{employee.f_name}"
	end

	def as_json(options = {})
		super((options || {}).merge({
			:methods => [:title]
		}))
	end
end
