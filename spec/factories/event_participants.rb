# == Schema Information
#
# Table name: event_participants
#
#  id               :bigint           not null, primary key
#  event_type       :string           not null
#  participant_type :string           not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  event_id         :bigint           not null
#  participant_id   :bigint           not null
#
# Indexes
#
#  index_event_participants_on_event        (event_type,event_id)
#  index_event_participants_on_participant  (participant_type,participant_id)
#
FactoryBot.define do
  factory :event_participant do
    event { nil }
    participant { nil }
  end
end
