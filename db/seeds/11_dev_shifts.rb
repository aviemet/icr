if Rails.env.development?

  if Client.first.calendar_events == 0

    attendant_job = JobTitle.find_by(slug: "attendant")

    ActiveRecord::Base.transaction do
      shift_length = 4

      5.times do |i|
        employee = FactoryBot.create(:employee)
        employee.assign_job_title(attendant_job)
        FactoryBot.create(:address, contact: employee.contact, category: Category.type(:address).sample)
        FactoryBot.create(:email, contact: employee.contact, category: Category.type(:email).sample)
        FactoryBot.create(:phone, contact: employee.contact, category: Category.type(:phone).sample)

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

  if Client.second.calendar_events

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
      end
    end

  end
end
