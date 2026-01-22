if Rails.env.development?

  # Add some employees for the first client and a couple months worth of shifts
  if Client.first.calendar_events.empty?

    attendant_job = Employee::JobTitle.find_by(slug: "attendant")

    ActiveRecord::Base.transaction do
      shift_length = 4

      5.times do |i|
        employee = FactoryBot.create(:employee)
        employee.assign_job_title(attendant_job)
        FactoryBot.create(:address, contact: employee.contact, category: Category.type("Contact::Address").sample)
        FactoryBot.create(:email, contact: employee.contact, category: Category.type("Contact::Email").sample)
        FactoryBot.create(:phone, contact: employee.contact, category: Category.type("Contact::Phone").sample)

        client = Client.first
        start = Time.current.beginning_of_month + (i * shift_length).hours

        240.times do |w|
          next unless w % 7 < 6

          shift = FactoryBot.create(:shift, {
            employee:,
            calendar_event: FactoryBot.create(:calendar_event, {
              starts_at: start,
              ends_at: start + shift_length.hours,
            },)
          },)

          client.calendar_events << shift.calendar_event

          start += 1.day
        end
      end
    end

  end

  # Add a couple months worth of shifts for the second client
  if Client.second.calendar_events.empty?

    ActiveRecord::Base.transaction do
      shift_length = 9

      client = Client.second

      base_start = Time.current.beginning_of_month

      240.times do |w|
        employee = Employee.find_by(id: Employee.pluck(:id)[w % 5])

        start_time = base_start + (w * shift_length).hours

        shift = FactoryBot.create(:shift, {
          employee:,
          calendar_event: FactoryBot.create(:calendar_event, {
            starts_at: start_time,
            ends_at: start_time + shift_length.hours,
          },)
        },)

        client.calendar_events << shift.calendar_event

        # Add some overlapping events
        next unless w % 10 == 0

        overlap_start = start_time + [*-2..2].sample.hours
        overlap_end = shift.calendar_event.ends_at + [*-2..2].sample.hours

        overlap_shift = FactoryBot.create(:shift, {
          employee: Employee.find_by(id: Employee.pluck(:id)[(w + 2) % 5]),
          calendar_event: FactoryBot.create(:calendar_event, {
            starts_at: overlap_start,
            ends_at: overlap_end,
          },)
        },)

        client.calendar_events << overlap_shift.calendar_event
      end
    end

  end
end
