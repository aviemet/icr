if Rails.env.development?

  dev_password = "Complex1!"
  test_timezone = "America/Los_Angeles"
  seed_start_date = Date.current.prev_month.beginning_of_month
  seed_end_date = (seed_start_date + 2.months).end_of_month
  seed_dates = (seed_start_date..seed_end_date).to_a
  attendant_job = Employee::JobTitle.find_by(slug: "attendant")

  create_shift_attendant = lambda do |client:|
    employee = FactoryBot.create(:employee, :employed)
    employee.assign_job_title(attendant_job)
    FactoryBot.create(:pay_rate, :active, employee: employee)
    FactoryBot.create(:clients_attendant, attendant: employee, client: client)
    employee
  end

  if Client.first.calendar_events.empty?
    ActiveRecord::Base.transaction do
      shift_length = 6
      client = Client.first
      first_attendant = nil

      5.times do |index|
        employee = create_shift_attendant.call(client: client)
        FactoryBot.create(:address, contact: employee.contact, category: Category.type("Contact::Address").sample)
        FactoryBot.create(:email, contact: employee.contact, category: Category.type("Contact::Email").sample)
        FactoryBot.create(:phone, contact: employee.contact, category: Category.type("Contact::Phone").sample)

        first_attendant = employee if index == 1

        seed_dates.each do |date|
          next if date.saturday? || date.sunday?

          starts_at = Time.zone.local(date.year, date.month, date.day) + (index * shift_length).hours

          shift = FactoryBot.create(:shift, {
            employee:,
            calendar_event: FactoryBot.create(:calendar_event, {
              starts_at:,
              ends_at: starts_at + shift_length.hours,
            })
          })

          client.calendar_events << shift.calendar_event
        end
      end

      unless User.exists?(email: "attendant@gmail.com")
        User.create({
          email: "attendant@gmail.com",
          password: dev_password,
          confirmed_at: Time.zone.now,
          time_zone: test_timezone,
          person: first_attendant.person
        })
      end
    end

    Rails.logger.info "[seeds] shifts: client 1 + attendant user"
  end

  if Shift.open.none? && Client.first.present?
    ActiveRecord::Base.transaction do
      client = Client.first
      open_shift_dates = seed_dates.select { |date| date.monday? || date.wednesday? }.first(4)

      open_shift_dates.each_with_index do |date, index|
        starts_at = Time.zone.local(date.year, date.month, date.day) + (18 + index).hours

        open_shift = FactoryBot.create(:shift, :open, {
          calendar_event: FactoryBot.create(:calendar_event, {
            starts_at:,
            ends_at: starts_at + 6.hours,
          })
        })

        client.calendar_events << open_shift.calendar_event
      end
    end

    Rails.logger.info "[seeds] open shifts: client 1"
  end

  if Client.second.calendar_events.empty? && Client.third.calendar_events.empty?
    ActiveRecord::Base.transaction do
      client_2 = Client.second
      client_3 = Client.third

      shift_length = 8
      shifts_per_day = 24 / shift_length

      employees_for_client_2 = 5.times.map { create_shift_attendant.call(client: client_2) }
      employees_for_client_3 = 5.times.map { create_shift_attendant.call(client: client_3) }

      seed_dates.each_with_index do |date, day_index|
        day_start = Time.zone.local(date.year, date.month, date.day)

        shifts_per_day.times do |shift_index|
          base_shift_start = day_start + (shift_index * shift_length).hours

          client_2_start = base_shift_start
          client_3_start = base_shift_start + 1.hour

          client_2_employee = employees_for_client_2[(day_index + shift_index) % employees_for_client_2.length]
          client_3_employee = employees_for_client_3[(day_index + shift_index) % employees_for_client_3.length]

          client_2_shift = FactoryBot.create(:shift, {
            employee: client_2_employee,
            calendar_event: FactoryBot.create(:calendar_event, {
              starts_at: client_2_start,
              ends_at: client_2_start + shift_length.hours,
            })
          })

          client_3_shift = FactoryBot.create(:shift, {
            employee: client_3_employee,
            calendar_event: FactoryBot.create(:calendar_event, {
              starts_at: client_3_start,
              ends_at: client_3_start + shift_length.hours,
            })
          })

          client_2.calendar_events << client_2_shift.calendar_event
          client_3.calendar_events << client_3_shift.calendar_event
        end
      end
    end

    Rails.logger.info "[seeds] shifts: household clients 2/3"
  end

  if Client.fourth.calendar_events.empty?
    client = Client.fourth

    ActiveRecord::Base.transaction do
      shift_length = 6

      primary_employees = 5.times.map do
        employee = create_shift_attendant.call(client: client)
        FactoryBot.create(:address, contact: employee.contact, category: Category.type("Contact::Address").sample)
        FactoryBot.create(:email, contact: employee.contact, category: Category.type("Contact::Email").sample)
        FactoryBot.create(:phone, contact: employee.contact, category: Category.type("Contact::Phone").sample)
        employee
      end

      primary_employees.each_with_index do |employee, employee_index|
        seed_dates.each_with_index do |date, day_index|
          next if date.saturday? || date.sunday?

          starts_at = Time.zone.local(date.year, date.month, date.day) + (employee_index * shift_length).hours

          shift = FactoryBot.create(:shift, {
            employee:,
            calendar_event: FactoryBot.create(:calendar_event, {
              starts_at:,
              ends_at: starts_at + shift_length.hours,
            })
          })

          client.calendar_events << shift.calendar_event

          next unless day_index % 10 == 0

          overlap_start = starts_at + [*-2..2].sample.hours
          overlap_end = shift.calendar_event.ends_at + [*-2..2].sample.hours
          overlap_employee = create_shift_attendant.call(client: client)

          overlap_shift = FactoryBot.create(:shift, {
            employee: overlap_employee,
            calendar_event: FactoryBot.create(:calendar_event, {
              starts_at: overlap_start,
              ends_at: overlap_end,
            })
          })

          client.calendar_events << overlap_shift.calendar_event
        end
      end
    end

    Rails.logger.info "[seeds] shifts: client 4 + overlaps"
  end
end
