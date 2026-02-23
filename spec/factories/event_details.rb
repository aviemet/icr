# == Schema Information
#
# Table name: event_details
#
#  id                :uuid             not null, primary key
#  description       :text
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  address_id        :uuid             not null
#  calendar_event_id :uuid             not null
#
# Indexes
#
#  index_event_details_on_address_id         (address_id)
#  index_event_details_on_calendar_event_id  (calendar_event_id)
#
# Foreign Keys
#
#  fk_rails_...  (address_id => addresses.id)
#  fk_rails_...  (calendar_event_id => calendar_events.id)
#
FactoryBot.define do
  factory :event_detail do

  end
end
