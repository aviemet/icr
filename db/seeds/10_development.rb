if Rails.env == "development"

  if User.count == 0
    User.create({
      email: "aviemet@gmail.com",
      password: "Complex1!",
      confirmed_at: Time.current,
      time_zone: "America/Los_Angeles",
      person:  Person.create({
        first_name: "Avram",
        middle_name: "True",
        last_name: "Walden",
      })
    })
  end

  if Client.count == 0
    6.times do
      FactoryBot.create :client
    end
  end

  if Employee.count == 0
    6.times do
      FactoryBot.create :employee
    end
  end

  if Shift.count == 0
    4.times do
      FactoryBot.create :shift
    end

    s = Shift.create({
      starts_at: Time.zone.now - 30,
      ends_at: Time.zone.now - 29,
      employee: Employee.first,
    })
    s.recurring_pattern = RecurringPattern.new({ recurring_type: 'daily' })
    s.shift_exceptions << ShiftException.new({
      rescheduled: Time.zone.now,
      starts_at: Time.zone.tomorrow,
      ends_at: Time.zone.tomorrow,
    })
    s.save
  end

  if Household.count == 0
    h = Household.create({ name: "Test Household" })
    h.clients << Client.first
    h.clients << Client.second
  end
end
