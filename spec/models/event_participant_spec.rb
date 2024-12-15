# == Schema Information
#
# Table name: event_participants
#
#  id                :uuid             not null, primary key
#  participant_type  :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_event_id :uuid             not null
#  participant_id    :uuid             not null
#
# Indexes
#
#  index_event_participants_on_calendar_event_id  (calendar_event_id)
#  index_event_participants_on_participant        (participant_type,participant_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_event_id => calendar_events.id)
#
require "rails_helper"

RSpec.describe EventParticipant do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:event_participant)).to be_valid
    end

    it "is invlalid with missing attributes" do
      %i().each do |attr|
        expect(build(:event_participant, attr => nil)).not_to be_valid
      end
    end
  end

  describe "Associations" do
    it{ is_expected.to belong_to(:calendar_event) }
    it{ is_expected.to belong_to(:participant) }
  end
end
