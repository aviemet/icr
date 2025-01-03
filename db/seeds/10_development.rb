if Rails.env.development?

  if User.count == 0
    user = User.create({
      email: "aviemet@gmail.com",
      password: "Complex1!",
      confirmed_at: Date.new,
      time_zone: "America/Los_Angeles"
    })
    user.add_role :super_admin

    Person.create({
      first_name: "Avram",
      middle_name: "True",
      last_name: "Walden",
      user: user
    })
  end

  if JobTitle.count == 0
    3.times do
      FactoryBot.create :job_title
    end
  end

  if Client.count == 0
    5.times do
      client = FactoryBot.create :client
      FactoryBot.create(:address, contact: client.contact)
      FactoryBot.create(:email, contact: client.contact)
      FactoryBot.create(:phone, contact: client.contact)
    end

    h = Household.create({ name: "Test Household" })
    h.clients << Client.second
    h.clients << Client.third
  end

  if Employee.count == 0
    5.times do |i|
      employee = FactoryBot.create :employee, job_title: JobTitle.find(JobTitle.pluck(:id).sample)
      FactoryBot.create(:address, contact: employee.contact, category: Category.type(:address).sample)
      FactoryBot.create(:email, contact: employee.contact, category: Category.type(:email).sample)
      FactoryBot.create(:phone, contact: employee.contact, category: Category.type(:phone).sample)

      client = Client.first
      start = Time.current.beginning_of_week + (i * 4).hours

      60.times do |w|
        next unless w % 7 < 6

        shift = FactoryBot.create(:shift, {
          employee:,
          calendar_event: FactoryBot.create(:calendar_event, {
            starts_at: start,
            ends_at: start + 4.hours,
          },)
        },)

        client.calendar_events << shift.calendar_event

        start += 1.day
      end
    end
  end

end
