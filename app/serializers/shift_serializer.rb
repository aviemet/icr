# == Schema Information
#
# Table name: shifts
#
#  id                   :bigint           not null, primary key
#  ends_at              :datetime
#  starts_at            :datetime
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  created_by_id        :bigint           not null
#  employee_id          :bigint
#  parent_id            :bigint
#  recurring_pattern_id :bigint
#
# Indexes
#
#  index_shifts_on_created_by_id         (created_by_id)
#  index_shifts_on_employee_id           (employee_id)
#  index_shifts_on_parent_id             (parent_id)
#  index_shifts_on_recurring_pattern_id  (recurring_pattern_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id)
#  fk_rails_...  (employee_id => people.id)
#  fk_rails_...  (parent_id => shifts.id)
#  fk_rails_...  (recurring_pattern_id => recurring_patterns.id)
#
class ShiftSerializer < ApplicationSerializer
  object_as :shift

  attributes(
    :title,
    :starts_at,
    :ends_at,
    :recurring_pattern_id,
    :employee_id,
    :created_by_id,
    :parent_id,
  )
end
