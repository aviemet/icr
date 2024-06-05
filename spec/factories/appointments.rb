# == Schema Information
#
# Table name: appointments
#
#  id                :bigint           not null, primary key
#  name              :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_event_id :bigint           not null
#
# Indexes
#
#  index_appointments_on_calendar_event_id  (calendar_event_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_event_id => calendar_events.id)
#
FactoryBot.define do
  factory :appointment do
    calendar_event { nil }
  end
end
