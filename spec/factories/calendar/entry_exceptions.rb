# == Schema Information
#
# Table name: calendar_entry_exceptions
#
#  id                :uuid             not null, primary key
#  cancelled         :datetime
#  ends_at           :datetime
#  rescheduled       :datetime
#  starts_at         :datetime
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_entry_id :uuid             not null
#
# Indexes
#
#  index_calendar_entry_exceptions_on_calendar_entry_id  (calendar_entry_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_entry_id => calendar_entries.id)
#
FactoryBot.define do
  factory :calendar_entry_exception, class: 'Calendar::EntryException' do
    rescheduled { Faker::Time.forward(days: 10) }
    cancelled { [true, false].sample ? Faker::Time.backward(days: 5) : nil }
    starts_at { Faker::Time.forward(days: 12, period: :morning) }
    ends_at { Faker::Time.forward(days: 12, period: :afternoon) }

    calendar_entry
  end
end
