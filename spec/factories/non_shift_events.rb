# == Schema Information
#
# Table name: non_shift_events
#
#  id                :uuid             not null, primary key
#  name              :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_entry_id :uuid             not null
#
# Indexes
#
#  index_non_shift_events_on_calendar_entry_id  (calendar_entry_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_entry_id => calendar_entries.id)
#
FactoryBot.define do
  factory :non_shift_event do
    name { Faker::Lorem.sentence(word_count: 3) }
    calendar_entry { nil }
  end
end
