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
require 'rails_helper'

RSpec.describe Calendar::EventException do
  describe 'Validations' do
    it 'is valid with valid attributes' do
      expect(build(:calendar_event_exception, :cancelled)).to be_valid
      expect(build(:calendar_event_exception, :rescheduled)).to be_valid
    end

    it 'is invalid with missing attributes' do
      %i(calendar_event).each do |attr|
        expect(build(:calendar_event_exception, { attr => nil })).not_to be_valid
      end
    end

    it 'is invalid unless exactly one of cancelled or scheduled is true' do
      expect(build(:calendar_event_exception, {
        cancelled: Faker::Time.forward(days: 12, period: :morning),
        rescheduled: Faker::Time.forward(days: 12, period: :afternoon)
        },)).not_to be_valid
      expect(build(:calendar_event_exception, { cancelled: nil, rescheduled: nil })).not_to be_valid
    end
  end

  describe 'Associations' do
    it { is_expected.to belong_to(:calendar_event) }
  end
end
