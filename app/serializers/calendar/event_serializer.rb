# == Schema Information
#
# Table name: calendar_events
#
#  id            :uuid             not null, primary key
#  ends_at       :datetime
#  name          :string           not null
#  starts_at     :datetime
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  category_id   :uuid
#  created_by_id :uuid             not null
#  employee_id   :uuid
#  parent_id     :uuid
#
# Indexes
#
#  index_calendar_events_on_category_id    (category_id)
#  index_calendar_events_on_created_by_id  (created_by_id)
#  index_calendar_events_on_employee_id    (employee_id)
#  index_calendar_events_on_parent_id      (parent_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (created_by_id => users.id)
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (parent_id => calendar_events.id)
#
class Calendar::EventSerializer < ApplicationSerializer
  object_as :event, model: "Calendar::Event"

  attributes(
    :name,
    :starts_at,
    :ends_at,
    :parent_id,
    :employee_id,
    :category_id,
    :created_by_id,
    :created_at,
    :updated_at,
  )

  has_many :recurring_patterns, serializer: Calendar::RecurringPatternSerializer
end
