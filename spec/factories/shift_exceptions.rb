FactoryBot.define do
  factory :shift_exception do
    event { nil }
    rescheduled { false }
    cancelled { false }
    starts_at { "2022-01-30 09:07:27" }
    ends_at { "2022-01-30 09:07:27" }
  end
end
