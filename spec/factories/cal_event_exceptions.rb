# == Schema Information
#
# Table name: cal_event_exceptions
#
#  id           :bigint           not null, primary key
#  cancelled    :datetime
#  ends_at      :datetime
#  rescheduled  :datetime
#  starts_at    :datetime
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  cal_event_id :bigint           not null
#
# Indexes
#
#  index_cal_event_exceptions_on_cal_event_id  (cal_event_id)
#
# Foreign Keys
#
#  fk_rails_...  (cal_event_id => cal_events.id)
#
FactoryBot.define do
  factory :cal_event_exception do
    rescheduled { Faker::Time.forward(days: 10) }
    cancelled { [true, false].sample ? Faker::Time.backward(days: 5) : nil }
    starts_at { Faker::Time.forward(days: 12, period: :morning) }
    ends_at { Faker::Time.forward(days: 12, period: :afternoon) }

    cal_event
  end
end
