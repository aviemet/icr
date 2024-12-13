# == Schema Information
#
# Table name: calendar_event_exceptions
#
#  id                :uuid             not null, primary key
#  cancelled         :datetime
#  ends_at           :datetime
#  rescheduled       :datetime
#  starts_at         :datetime
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_event_id :uuid             not null
#
# Indexes
#
#  index_calendar_event_exceptions_on_calendar_event_id  (calendar_event_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_event_id => calendar_events.id)
#
FactoryBot.define do
  factory :calendar_event_exception, class: 'Calendar::EventException' do
    trait :cancelled do
      rescheduled { nil }
      cancelled { Faker::Time.backward(days: 5) }
    end

    trait :rescheduled do
      rescheduled { Faker::Time.forward(days: 10) }
      cancelled { nil }
    end

    rescheduled { nil }
    cancelled { nil }
    starts_at { Faker::Time.forward(days: 12, period: :morning) }
    ends_at { Faker::Time.forward(days: 12, period: :afternoon) }

    calendar_event
  end
end
