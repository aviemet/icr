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
#  parent_id     :uuid
#
# Indexes
#
#  index_calendar_events_on_category_id    (category_id)
#  index_calendar_events_on_created_by_id  (created_by_id)
#  index_calendar_events_on_parent_id      (parent_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (created_by_id => users.id)
#  fk_rails_...  (parent_id => calendar_events.id)
#
now = Time.zone.now

FactoryBot.define do
  sequence :start_time do |n|
    Time.zone.local(
      now.year,
      now.month,
      now.day + ((n * 2) / 24).to_i,
      ((n * 2) + 8) % 24,
    )
  end

  sequence :end_time do |n|
    Time.zone.local(
      now.year,
      now.month,
      now.day + ((n * 2) / 24).to_i,
      ((n * 2) + 10) % 24,
    )
  end

  factory :calendar_event, class: "Calendar::Event" do
    name { Faker::Company.bs }
    starts_at { generate(:start_time) }
    ends_at { generate(:end_time) }

    created_by factory: :user

    category { Category.find_by(slug: "event-shift") }
  end

end
