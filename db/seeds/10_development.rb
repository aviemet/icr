if Rails.env.development?
  if Setting.none?
    Setting.company_name = "ICR SLS"
    Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:semi_monthly]
  end

  dev_password = "Complex1!"
  test_timezone = "America/Los_Angeles"

  if User.none?
    admin = User.create({
      email: "aviemet@gmail.com",
      password: dev_password,
      confirmed_at: Time.zone.now,
      time_zone: test_timezone
    })
    admin.add_role :admin

    Person.create({
      first_name: "Avram",
      middle_name: "True",
      last_name: "Walden",
      user: admin
    })
  end

  if Employee::JobTitle.none?
    Employee::JobTitle.create({ name: "Attendant" })
    Employee::JobTitle.create({ name: "Facilitator" })
    Employee::JobTitle.create({ name: "Director" })
  end

  if Client.none?
    3.times do
      client = FactoryBot.create :client
      FactoryBot.create(:address, contact: client.contact, category: Category.type("Contact::Address").find_by(name: "Personal"))
      FactoryBot.create(:email, contact: client.contact, category: Category.type("Contact::Email").find_by(name: "Personal"))
      FactoryBot.create(:phone, contact: client.contact, category: Category.type("Contact::Phone").find_by(name: "Home"))
    end

    h = Household.create({ name: "Test Household" })
    h.clients << Client.second
    h.clients << Client.third

    # Test client User
    User.create({
      email: "client@gmail.com",
      password: dev_password,
      confirmed_at: Time.zone.now,
      time_zone: test_timezone,
      person: Client.first.person
    })
  end

  if Employee.none?
    ActiveRecord::Base.transaction do
      facilitator_user = User.create({
        email: "facilitator@gmail.com",
        password: dev_password,
        confirmed_at: Time.zone.now,
        time_zone: test_timezone,
        person: FactoryBot.create(:person)
      })

      facilitator = FactoryBot.create(:employee, {
        person: facilitator_user.person,
        status: :employed
      })

      facilitator.assign_job_title(Employee::JobTitle.find_by(slug: "facilitator"))

      FactoryBot.create(:address, contact: facilitator.person.contact, category: Category.type("Contact::Address").sample)
      FactoryBot.create(:phone, contact: facilitator.person.contact, category: Category.type("Contact::Phone").sample)

      # Test facilitator User
      director_user = User.create({
        email: "director@gmail.com",
        password: dev_password,
        confirmed_at: Time.zone.now,
        time_zone: test_timezone,
        person: FactoryBot.create(:person)
      })

      director = FactoryBot.create(:employee, {
        person: director_user.person
      })

      director.assign_job_title(Employee::JobTitle.find_by(slug: "director"))

      FactoryBot.create(:address, contact: director.person.contact, category: Category.type("Contact::Address").sample)
      FactoryBot.create(:phone, contact: director.person.contact, category: Category.type("Contact::Phone").sample)
    end
  end

end
