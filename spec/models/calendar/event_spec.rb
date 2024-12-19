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
require "rails_helper"

RSpec.describe Calendar::Event do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:calendar_event)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(starts_at ends_at name category_id).each do |attr|
        expect(build(:calendar_event, { attr => nil })).not_to be_valid
      end
    end

    it "is invalid if starts_at is before ends_at" do
      expect(build(:calendar_event, {
        starts_at: Time.zone.now,
        ends_at: 1.hour.ago,
      },)).not_to be_valid
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:parent).optional }
    it { is_expected.to belong_to(:category) }
    it { is_expected.to belong_to(:employee).optional }
    it { is_expected.to belong_to(:created_by).optional }

    it { is_expected.to have_many(:calendar_recurring_patterns) }
    it { is_expected.to have_many(:clients).through(:event_participants) }
    it { is_expected.to have_many(:households).through(:event_participants) }
  end

  describe "Scopes" do
    # Create the events only before running the scope tests
    before do
      @event1 = create(:calendar_event, {
        starts_at: 1.day.ago,
        ends_at: 1.hour.ago
      },)
      @event2 = create(:calendar_event, {
        starts_at: 3.days.ago,
        ends_at: 2.days.ago
      },)
      @event3 = create(:calendar_event, {
        starts_at: 7.days.ago,
        ends_at: 6.days.ago
      },)
      @event4 = create(:calendar_event, {
        starts_at: 1.hour.from_now,
        ends_at: 2.hours.from_now
      },)
      @event5 = create(:calendar_event, {
        starts_at: 2.days.from_now,
        ends_at: 3.days.from_now
      },)
      @event6 = create(:calendar_event, {
        starts_at: 1.week.from_now,
        ends_at: 1.week.from_now + 1.day
      },)
    end

    describe ".before" do
      it "fetches events which start before the given time" do
        time = 2.days.ago
        events = described_class.before(time)

        expect(events).to include(@event2, @event3)
        expect(events).not_to include(@event1, @event4, @event5, @event6)
      end
    end

    describe ".after" do
      it "returns events end after the given time" do
        time = 1.day.from_now
        events = described_class.after(time)

        expect(events).to include(@event5, @event6)
        expect(events).not_to include(@event1, @event2, @event3, @event4)
      end
    end

    describe ".between" do
      it "returns events which occur within the given time range" do
        start_time = 1.day.ago + 1.hour
        end_time = 1.week.from_now - 1.hour
        events = described_class.between(start_time, end_time)

        expect(events).to include(@event1, @event4, @event5)
        expect(events).not_to include(@event2, @event3, @event6)
      end
    end

  end
end
