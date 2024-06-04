# == Schema Information
#
# Table name: shifts
#
#  id          :bigint           not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  employee_id :bigint           not null
#
# Indexes
#
#  index_shifts_on_employee_id  (employee_id)
#
# Foreign Keys
#
#  fk_rails_...  (employee_id => employees.id)
#
class ShiftSerializer < ApplicationSerializer
  object_as :shift

  attributes(
    :starts_at,
    :ends_at,
    :recurring_pattern_id,
    :client_id,
    :employee_id,
    :created_by_id,
    :parent_id,
    title: { type: :string },
  )
end
