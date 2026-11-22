# == Schema Information
#
# Table name: calendar_recurring_patterns
#
#  id                :uuid             not null, primary key
#  day_of_month      :integer
#  day_of_week       :integer
#  end_date          :date
#  max_occurrences   :integer
#  month_of_year     :integer
#  offset            :integer          default(1), not null
#  recurring_type    :integer          not null
#  week_of_month     :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  calendar_event_id :uuid             not null
#
# Indexes
#
#  index_calendar_recurring_patterns_on_calendar_event_id  (calendar_event_id)
#
# Foreign Keys
#
#  fk_rails_...  (calendar_event_id => calendar_events.id)
#
require "rails_helper"

RSpec.describe Calendar::RecurringPattern do
  describe "Validations" do
    it "is valid with valid attributes" do
      expect(build(:calendar_recurring_pattern)).to be_valid
    end

    it "is invalid with missing attributes" do
      %i(recurring_type offset).each do |attr|
        expect(build(:calendar_recurring_pattern, { attr => nil })).not_to be_valid
      end
    end

    it "requires day_of_week for weekly patterns" do
      expect(build(:calendar_recurring_pattern, day_of_week: nil)).not_to be_valid
    end

    it "allows a blank end_date for open-ended series" do
      expect(build(:calendar_recurring_pattern, end_date: nil)).to be_valid
    end

    it "allows max_occurrences without end_date" do
      expect(build(:calendar_recurring_pattern, end_date: nil, max_occurrences: 8)).to be_valid
    end

    it "rejects end_date before the event start" do
      event = build(:calendar_event, starts_at: Time.zone.parse("2026-11-16 09:00"), ends_at: Time.zone.parse("2026-11-16 17:00"))
      pattern = build(
        :calendar_recurring_pattern,
        calendar_event: event,
        day_of_week: 1,
        end_date: event.starts_at.to_date - 1.day,
      )

      expect(pattern).not_to be_valid
      expect(pattern.errors[:end_date]).to be_present
    end

    it "is valid for daily patterns" do
      expect(build(:calendar_recurring_pattern, recurring_type: :daily, day_of_week: nil, end_date: nil)).to be_valid
    end

    it "requires a monthly anchor" do
      pattern = build(:calendar_recurring_pattern, recurring_type: :monthly, day_of_week: nil, day_of_month: nil, week_of_month: nil)
      expect(pattern).not_to be_valid
      expect(pattern.errors[:base]).to be_present
    end

    it "is valid for monthly day-of-month patterns" do
      expect(build(
        :calendar_recurring_pattern,
        recurring_type: :monthly,
        day_of_week: nil,
        day_of_month: 15,
        end_date: nil,
      )).to be_valid
    end

    it "is valid for monthly nth-weekday patterns" do
      expect(build(
        :calendar_recurring_pattern,
        recurring_type: :monthly,
        day_of_week: 1,
        week_of_month: 3,
        day_of_month: nil,
        end_date: nil,
      )).to be_valid
    end

    it "requires a yearly anchor" do
      pattern = build(
        :calendar_recurring_pattern,
        recurring_type: :yearly,
        day_of_week: nil,
        month_of_year: nil,
        day_of_month: nil,
      )
      expect(pattern).not_to be_valid
      expect(pattern.errors[:base]).to be_present
    end

    it "is valid for yearly patterns" do
      expect(build(
        :calendar_recurring_pattern,
        recurring_type: :yearly,
        day_of_week: nil,
        month_of_year: 11,
        day_of_month: 16,
        end_date: nil,
      )).to be_valid
    end
  end

  describe "Associations" do
    it { is_expected.to belong_to(:calendar_event) }
  end
end
