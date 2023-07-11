now = Time.current

FactoryBot.define do
  sequence :start_time do |n|
    Time.new(now.year, now.month, now.day, 0) + ((n + (n * 8)) * 3600)
  end

  sequence :end_time do |n|
    Time.new(now.year, now.month, now.day, 0) + ((n + (n * 8) + 9) * 3600)
  end

  factory :shift do |_time|
    starts_at { generate(:start_time) }
    ends_at { generate(:end_time) }
    created_by { User.first }
    employee { Employee.order("RANDOM()").first }
    clients { [Client.first] }
  end
end
