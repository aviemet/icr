# == Schema Information
#
# Table name: calendar_recurring_patterns
#
#  id                :uuid             not null, primary key
#  day_of_month      :integer
#  day_of_week       :integer
#  end_date          :integer
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
  end

  describe "Associations" do
    it { is_expected.to belong_to(:calendar_event) }
  end
end
