# == Schema Information
#
# Table name: shift_exceptions
#
#  id          :bigint           not null, primary key
#  cancelled   :datetime
#  ends_at     :datetime
#  rescheduled :datetime
#  starts_at   :datetime
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  shift_id    :bigint           not null
#
# Indexes
#
#  index_shift_exceptions_on_shift_id  (shift_id)
#
# Foreign Keys
#
#  fk_rails_...  (shift_id => shifts.id)
#
FactoryBot.define do
  factory :shift_exception do
    event { nil }
    rescheduled { false }
    cancelled { false }
    starts_at { "2022-01-30 09:07:27" }
    ends_at { "2022-01-30 09:07:27" }
  end
end
