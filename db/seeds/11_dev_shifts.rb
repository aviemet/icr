if Rails.env.development?

  dev_password = "Complex1!"
  test_timezone = "America/Los_Angeles"
  seed_anchor_date = Date.current.prev_month.beginning_of_month
  seed_anchor_date += 1 until (1..5).cover?(seed_anchor_date.wday)
  attendant_job = Employee::JobTitle.find_by(slug: "attendant")

  create_shift_attendant = lambda do |client:|
    employee = FactoryBot.create(:employee, :employed)
    employee.assign_job_title(attendant_job)
    FactoryBot.create(:pay_rate, :active, employee: employee)
    FactoryBot.create(:clients_attendant, attendant: employee, client: client)
    employee
  end

  create_recurring_shift = lambda do |client:, employee:, starts_at:, duration:, patterns:|
    calendar_event = FactoryBot.create(:calendar_event, {
      starts_at: starts_at,
      ends_at: starts_at + duration,
    })
    shift_attrs = { calendar_event: calendar_event }
    if employee.nil?
      FactoryBot.create(:shift, :open, shift_attrs)
    else
      FactoryBot.create(:shift, shift_attrs.merge(employee: employee))
    end
    patterns.each do |pattern_attrs|
      calendar_event.recurring_patterns.create!(pattern_attrs)
    end
    client.calendar_events << calendar_event
    calendar_event
  end

  weekday_patterns = (1..5).map { |day_of_week|
    {
      recurring_type: :weekly,
      offset: 1,
      day_of_week: day_of_week,
    }
  }

  if Client.first.calendar_events.empty?
    ActiveRecord::Base.transaction do
      shift_length = 6.hours
      client = Client.first
      first_attendant = nil

      5.times do |index|
        employee = create_shift_attendant.call(client: client)
        FactoryBot.create(:address, contact: employee.contact, category: Category.type("Contact::Address").sample)
        FactoryBot.create(:email, contact: employee.contact, category: Category.type("Contact::Email").sample)
        FactoryBot.create(:phone, contact: employee.contact, category: Category.type("Contact::Phone").sample)

        first_attendant = employee if index == 1

        starts_at = Time.zone.local(
          seed_anchor_date.year,
          seed_anchor_date.month,
          seed_anchor_date.day,
        ) + (index * shift_length)

        create_recurring_shift.call(
          client: client,
          employee: employee,
          starts_at: starts_at,
          duration: shift_length,
          patterns: weekday_patterns,
        )
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

    Rails.logger.info "[seeds] recurring weekday shifts: client 1 + attendant user"
  end

  if Shift.open.none? && Client.first.present?
    ActiveRecord::Base.transaction do
      client = Client.first
      open_anchor = seed_anchor_date
      open_anchor += 1 until open_anchor.monday? || open_anchor.wednesday?
      starts_at = Time.zone.local(open_anchor.year, open_anchor.month, open_anchor.day, 18, 0, 0)

      create_recurring_shift.call(
        client: client,
        employee: nil,
        starts_at: starts_at,
        duration: 6.hours,
        patterns: [
          { recurring_type: :weekly, offset: 1, day_of_week: 1 },
          { recurring_type: :weekly, offset: 1, day_of_week: 3 },
        ],
      )
    end

    Rails.logger.info "[seeds] recurring open shifts: client 1"
  end

  if Client.second.calendar_events.empty? && Client.third.calendar_events.empty?
    ActiveRecord::Base.transaction do
      client_2 = Client.second
      client_3 = Client.third

      shift_length = 8.hours
      shifts_per_day = 3
      daily_pattern = [{ recurring_type: :daily, offset: 1 }]

      employees_for_client_2 = shifts_per_day.times.map { create_shift_attendant.call(client: client_2) }
      employees_for_client_3 = shifts_per_day.times.map { create_shift_attendant.call(client: client_3) }

      day_start = Time.zone.local(seed_anchor_date.year, seed_anchor_date.month, seed_anchor_date.day)

      shifts_per_day.times do |shift_index|
        base_shift_start = day_start + (shift_index * shift_length)

        create_recurring_shift.call(
          client: client_2,
          employee: employees_for_client_2[shift_index],
          starts_at: base_shift_start,
          duration: shift_length,
          patterns: daily_pattern,
        )

        create_recurring_shift.call(
          client: client_3,
          employee: employees_for_client_3[shift_index],
          starts_at: base_shift_start + 1.hour,
          duration: shift_length,
          patterns: daily_pattern,
        )
      end
    end

    Rails.logger.info "[seeds] recurring daily shifts: household clients 2/3"
  end

  if Client.fourth.calendar_events.empty?
    client = Client.fourth

    ActiveRecord::Base.transaction do
      shift_length = 6.hours

      primary_employees = 5.times.map do
        employee = create_shift_attendant.call(client: client)
        FactoryBot.create(:address, contact: employee.contact, category: Category.type("Contact::Address").sample)
        FactoryBot.create(:email, contact: employee.contact, category: Category.type("Contact::Email").sample)
        FactoryBot.create(:phone, contact: employee.contact, category: Category.type("Contact::Phone").sample)
        employee
      end

      primary_employees.each_with_index do |employee, employee_index|
        starts_at = Time.zone.local(
          seed_anchor_date.year,
          seed_anchor_date.month,
          seed_anchor_date.day,
        ) + (employee_index * shift_length)

        create_recurring_shift.call(
          client: client,
          employee: employee,
          starts_at: starts_at,
          duration: shift_length,
          patterns: weekday_patterns,
        )
      end

      overlap_date = seed_anchor_date + 14.days
      overlap_date += 1 until (1..5).cover?(overlap_date.wday)
      overlap_start = Time.zone.local(overlap_date.year, overlap_date.month, overlap_date.day, 8, 0, 0)
      overlap_employee = create_shift_attendant.call(client: client)
      overlap_event = FactoryBot.create(:calendar_event, {
        starts_at: overlap_start,
        ends_at: overlap_start + 8.hours,
      })
      FactoryBot.create(:shift, {
        employee: overlap_employee,
        calendar_event: overlap_event,
      })
      client.calendar_events << overlap_event
    end

    Rails.logger.info "[seeds] recurring weekday shifts: client 4 + one-off overlap"
  end
end
