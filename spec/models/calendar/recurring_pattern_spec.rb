# == Schema Information
#
# Table name: calendar_recurring_patterns
#
#  id              :uuid             not null, primary key
#  day_of_month    :integer
#  day_of_week     :integer
#  end_date        :integer
#  max_occurrences :integer
#  month_of_year   :integer
#  offset          :integer          default(1), not null
#  recurring_type  :integer          not null
#  week_of_month   :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
require "rails_helper"

RSpec.describe Calendar::RecurringPattern do
  pending "add some examples to (or delete) #{__FILE__}"
end
