FactoryBot.define do
  factory :recurring_pattern do
    event { nil }
    recurring_type { 1 }
    separation_count { 1 }
    max_occurances { 1 }
    day_of_week { 1 }
    week_of_month { 1 }
    day_of_month { 1 }
    month_of_year { 1 }
  end
end
