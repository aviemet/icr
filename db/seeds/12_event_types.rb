if Rails.env.development?
  if Client.second.calendar_events.all_day.empty? # rubocop:disable Style/SoleNestedConditional
    ActiveRecord::Base.transaction do
      10.times do |i|
        starts_at =  Date.current + (i * 4).days
        event = Calendar::Event.create!({
          all_day: true,
          starts_at:,
          ends_at: i % 3 == 0 ? starts_at + 1.day : nil,
          name: "All Day Event ##{i + 1}"
        })
        EventParticipant.create!(calendar_event: event, participant: Client.second)
      end
    end
  end
end
