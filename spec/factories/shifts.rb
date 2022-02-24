now = Time.zone.now

FactoryBot.define do
  sequence :start_time do |n|
    Time.zone.new(now.year, now.month, now.day, n + 10)
  end

  sequence :end_time do |n|
    Time.zone.new(now.year, now.month, now.day, n + 11)
  end

  factory :shift do |_time|
    starts_at { generate(:start_time) }
    ends_at { generate(:end_time) }
    created_by { User.first }
    employee { Employee.first }
    clients { [Client.first] }
  end
end
