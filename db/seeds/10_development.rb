if Setting.count == 0
  Setting.company_name = "ICR"
  Setting.default_language = "en"
  Setting.default_currency = "USD"
  Setting.default_timezone = "America/Los_Angeles"
  Setting.pay_period_type = Setting::PAY_PERIOD_TYPES[:semi_monthly]
end

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
      time_zone: "America/Los_Angeles",
      job_title: JobTitle.find_by(slug: "facilitator"),
    })
    facilitator_user.add_role :facilitator

    facilitator = FactoryBot.create(:person, user: facilitator_user)
    FactoryBot.create :employee, job_title: JobTitle.find_by(slug: "facilitator"), person: facilitator
    FactoryBot.create(:address, contact: facilitator.contact, category: Category.type(:address).sample)
    FactoryBot.create(:phone, contact: facilitator.contact, category: Category.type(:phone).sample)

    director_user = User.create({
      email: "director@gmail.com",
      password: dev_password,
      confirmed_at: Date.new,
      time_zone: "America/Los_Angeles",
      job_title: JobTitle.find_by(slug: "director"),
    })
    director_user.add_role :director

    director = FactoryBot.create(:person, user: director_user)
    FactoryBot.create :employee, job_title: JobTitle.find_by(slug: "director"), person: director
    FactoryBot.create(:address, contact: director.contact, category: Category.type(:address).sample)
    FactoryBot.create(:phone, contact: director.contact, category: Category.type(:phone).sample)

  end

end
