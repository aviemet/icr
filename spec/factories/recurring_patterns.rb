# == Schema Information
#
# Table name: recurring_patterns
#
#  id             :bigint           not null, primary key
#  day_of_month   :integer
#  day_of_week    :integer
#  end_date       :integer
#  max_occurances :integer
#  month_of_year  :integer
#  offset         :integer          default(1), not null
#  recurring_type :integer          not null
#  week_of_month  :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#
FactoryBot.define do
  factory :recurring_pattern do
    # recurring_type { 1 }
    # separation_count { 1 }
    # max_occurances { 1 }
    # day_of_week { 1 }
    # week_of_month { 1 }
    # day_of_month { 1 }
    # month_of_year { 1 }

    calendar_event
  end
end
