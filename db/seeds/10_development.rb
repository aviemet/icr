if Rails.env.development?
  dev_password = "Complex1!"

  if User.count == 0
    admin = User.create({
      email: "aviemet@gmail.com",
      password: dev_password,
      confirmed_at: Date.new,
      time_zone: "America/Los_Angeles"
    })
    admin.add_role :super_admin

    Person.create({
      first_name: "Avram",
      middle_name: "True",
      last_name: "Walden",
      user: admin
    })

  end

  if JobTitle.count == 0
    JobTitle.create({ name: "Caregiver" })
    JobTitle.create({ name: "Facilitator" })
    JobTitle.create({ name: "Director" })
  end

  if Client.count == 0
    3.times do
      client = FactoryBot.create :client
      FactoryBot.create(:address, contact: client.contact)
      FactoryBot.create(:email, contact: client.contact)
      FactoryBot.create(:phone, contact: client.contact)
    end

    h = Household.create({ name: "Test Household" })
    h.clients << Client.second
    h.clients << Client.third

    client_user = User.create({
      email: "client@gmail.com",
      password: dev_password,
      confirmed_at: Date.new,
      time_zone: "America/Los_Angeles"
    })
    client_user.add_role :client
  end

  if Employee.count == 0
    facilitator_user = User.create({
      email: "facilitator@gmail.com",
      password: dev_password,
      confirmed_at: Date.new,
      time_zone: "America/Los_Angeles"
    })
    admin.add_role :facilitator

    facilitator = FactoryBot.create(:person, user: facilitator_user)
    FactoryBot.create :employee, job_title: JobTitle.find_by(slug: "facilitator"), person: facilitator
    FactoryBot.create(:address, contact: facilitator.contact, category: Category.type(:address).sample)
    FactoryBot.create(:phone, contact: facilitator.contact, category: Category.type(:phone).sample)

    director_user = User.create({
      email: "director@gmail.com",
      password: dev_password,
      confirmed_at: Date.new,
      time_zone: "America/Los_Angeles"
    })
    admin.add_role :director

    director = FactoryBot.create(:person, user: director_user)
    FactoryBot.create :employee, job_title: JobTitle.find_by(slug: "director"), person: director
    FactoryBot.create(:address, contact: director.contact, category: Category.type(:address).sample)
    FactoryBot.create(:phone, contact: director.contact, category: Category.type(:phone).sample)

    5.times do |i|
      employee = FactoryBot.create :employee, job_title: JobTitle.find_by(slug: "caregiver")
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
