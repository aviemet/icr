if Rails.env.development?
  if Client.second.calendar_events.all_day.empty? # rubocop:disable Style/SoleNestedConditional
    ActiveRecord::Base.transaction do
      10.times do |i|
        event = Calendar::Event.create!({
          all_day: true,
          starts_at: Date.current + (i * 3).days,
          name: "All Day Event ##{i + 1}"
        })
        EventParticipant.create!(calendar_event: event, participant: Client.second)
      end
    end
  end
end
