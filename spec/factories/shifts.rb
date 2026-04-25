# == Schema Information
#
# Table name: shifts
#
#  id                :uuid             not null, primary key
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_event_id :uuid             not null
#  category_id       :uuid             not null
#  employee_id       :uuid             not null
#  timesheet_id      :uuid
#
# Indexes
#
#  index_shifts_on_calendar_event_id  (calendar_event_id) UNIQUE
#  index_shifts_on_category_id        (category_id)
#  index_shifts_on_employee_id        (employee_id)
#  index_shifts_on_timesheet_id       (timesheet_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_event_id => calendar_events.id)
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (employee_id => employees.id)
#  fk_rails_...  (timesheet_id => timesheets.id)
#
FactoryBot.define do
  factory :shift do
    employee
    calendar_event { association :calendar_event }

    after(:build) do |shift|
      if shift.calendar_event
        shift.calendar_event.category_id = Category.type("Calendar::Event").find_by!(name: "Shift").id
      end
      shift.category_id = Category.type("Shift").find_by!(name: "Regular").id
    end
  end
end
