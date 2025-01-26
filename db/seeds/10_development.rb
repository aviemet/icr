if Rails.env.development?
  if Setting.count == 0
    Setting.company_name = "ICR SLS"
    Setting.pay_period_type = Setting::PAY_PERIOD_TYPES[:semi_monthly]
  end

  dev_password = "Complex1!"

  if User.count == 0
    admin = User.create({
      email: "aviemet@gmail.com",
      password: dev_password,
      confirmed_at: Date.new,
      time_zone: "America/Los_Angeles"
    })
    admin.add_role :admin

    Person.create({
      first_name: "Avram",
      middle_name: "True",
      last_name: "Walden",
      user: admin
    })

  end

  if JobTitle.count == 0
    JobTitle.create({ name: "Attendant" })
    JobTitle.create({ name: "Facilitator" })
    JobTitle.create({ name: "Director" })
  end

  if Client.count == 0
    3.times do
      client = FactoryBot.create :client
      FactoryBot.create(:address, contact: client.contact, category: Category.type("Address").find_by(name: "Personal"))
      FactoryBot.create(:email, contact: client.contact, category: Category.type("Email").find_by(name: "Personal"))
      FactoryBot.create(:phone, contact: client.contact, category: Category.type("Phone").find_by(name: "Home"))
    end

    h = Household.create({ name: "Test Household" })
    h.clients << Client.second
    h.clients << Client.third

    User.create({
      email: "client@gmail.com",
      password: dev_password,
      confirmed_at: Date.new,
      time_zone: "America/Los_Angeles"
    })
  end

  if Employee.count == 0
    facilitator_user = User.create({
      email: "facilitator@gmail.com",
      password: dev_password,
      confirmed_at: Date.new,
      time_zone: "America/Los_Angeles",
      person: FactoryBot.create(:person)
    })

    facilitator = FactoryBot.create(:employee, {
      person: facilitator_user.person
    },)

    facilitator.assign_job_title(JobTitle.find_by(slug: "facilitator"))

    FactoryBot.create(:address, contact: facilitator.person.contact, category: Category.type(:address).sample)
    FactoryBot.create(:phone, contact: facilitator.person.contact, category: Category.type(:phone).sample)

    director_user = User.create({
      email: "director@gmail.com",
      password: dev_password,
      confirmed_at: Date.new,
      time_zone: "America/Los_Angeles",
      person: FactoryBot.create(:person)
    })

    director = FactoryBot.create(:employee, {
      person: director_user.person
    },)

    director.assign_job_title(JobTitle.find_by(slug: "director"))

    FactoryBot.create(:address, contact: director.person.contact, category: Category.type(:address).sample)
    FactoryBot.create(:phone, contact: director.person.contact, category: Category.type(:phone).sample)

  end

end
