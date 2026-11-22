if Rails.env.development?
  if Setting.none?
    Setting.company_name = "ICR SLS"
    Setting.payroll_period_type = Setting::PAY_PERIOD_TYPES[:semi_monthly]
    Setting.primary_color = "#228be6"
    Setting.notifications_payroll_approval_reminders = true

    Rails.logger.info "[seeds] settings"
  end

  company = Company.instance
  company.update!(name: Setting.company_name) if company.name != Setting.company_name
  Rails.logger.info "[seeds] company"

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

    Rails.logger.info "[seeds] admin user"
  end

  if Client.none?
    4.times do
      client = FactoryBot.create(:client, :with_profile)
      FactoryBot.create(:address, contact: client.contact, category: Category.type("Contact::Address").find_by(name: "Personal"))
      FactoryBot.create(:email, contact: client.contact, category: Category.type("Contact::Email").find_by(name: "Personal"))
      FactoryBot.create(:phone, contact: client.contact, category: Category.type("Contact::Phone").find_by(name: "Home"))
      FactoryBot.create(:client_life_detail, client: client)
      FactoryBot.create(:client_allergy, client: client)
      FactoryBot.create(:client_diagnosis, client: client)
      FactoryBot.create(:client_support_contact, client: client)
    end

    h = Household.create({ name: "Test Household" })
    h.clients << Client.second
    h.clients << Client.third

    User.create({
      email: "client@gmail.com",
      password: dev_password,
      confirmed_at: Time.zone.now,
      time_zone: test_timezone,
      person: Client.first.person
    })

    Rails.logger.info "[seeds] clients (4) + household + client user"
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
      FactoryBot.create(:pay_rate, :active, employee: facilitator)

      FactoryBot.create(:address, contact: facilitator.person.contact, category: Category.type("Contact::Address").sample)
      FactoryBot.create(:phone, contact: facilitator.person.contact, category: Category.type("Contact::Phone").sample)

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
      FactoryBot.create(:pay_rate, :active, employee: director)

      FactoryBot.create(:address, contact: director.person.contact, category: Category.type("Contact::Address").sample)
      FactoryBot.create(:phone, contact: director.person.contact, category: Category.type("Contact::Phone").sample)

      attendant_user = User.create({
        email: "attendant@gmail.com",
        password: dev_password,
        confirmed_at: Time.zone.now,
        time_zone: test_timezone,
        person: FactoryBot.create(:person)
      })

      attendant = FactoryBot.create(:employee, {
        person: attendant_user.person,
        status: :employed
      })

      attendant.assign_job_title(Employee::JobTitle.find_by(slug: "attendant"))

      FactoryBot.create(:employees_manager, employee: attendant, manager: facilitator, primary: true)
      FactoryBot.create(:pay_rate, :active, employee: attendant)
      FactoryBot.create(:employee_credential, employee: attendant, expires_on: 20.days.from_now)
      FactoryBot.create(:employee_clearance, employee: attendant)
      FactoryBot.create(:employee_support_contact, employee: attendant)

      if Client.any?
        FactoryBot.create(:clients_attendant, attendant: attendant, client: Client.first)
        FactoryBot.create(:clients_manager, manager: facilitator, client: Client.first)
      end

      training = Employee::Training.find_or_create_by!(name: "Orientation") do |record|
        record.description = "New hire orientation"
        record.estimated_minutes = 60
        record.status = :active
      end
      FactoryBot.create(:employees_training, employee: attendant, training: training, completed_at: nil, started_at: Time.current)
      FactoryBot.create(:employees_training, employee: facilitator, training: training, completed_at: Time.current)

      attendant_job = Employee::JobTitle.find_by(slug: "attendant")

      applicant = FactoryBot.create(:employee, {
        status: :applicant,
        application_source: "Indeed",
        desired_compensation_cents: 2200,
        desired_compensation_currency: "USD",
        desired_compensation_period: :hourly,
        desired_job_title: attendant_job,
        hiring_notes: "Referred by current attendant. Available evenings and weekends.",
      })
      FactoryBot.create(:address, contact: applicant.person.contact, category: Category.type("Contact::Address").sample)
      FactoryBot.create(:phone, contact: applicant.person.contact, category: Category.type("Contact::Phone").sample)

      interview = FactoryBot.create(:interview, {
        employee: applicant,
        scheduled_at: 3.days.from_now.change(hour: 10, min: 0),
        location: "Main office conference room",
        interview_type: "in_person",
        notes: "Panel interview with facilitator and director.",
      })
      FactoryBot.create(:interview_participant, interview: interview, person: facilitator.person)
      FactoryBot.create(:interview_note, {
        interview: interview,
        employee: facilitator,
        note: "Strong communication skills. Comfortable with overnight shifts.",
        recommendation: :yes,
      })

      offered_applicant = FactoryBot.create(:employee, {
        status: :applicant,
        application_source: "Referral",
        desired_compensation_cents: 2400,
        desired_compensation_currency: "USD",
        desired_compensation_period: :hourly,
        desired_job_title: attendant_job,
        hiring_notes: "Former SLS staff. Ready to start within two weeks.",
      })
      FactoryBot.create(:employee_offer, :extended, {
        employee: offered_applicant,
        job_title: attendant_job,
        proposed_start_on: 2.weeks.from_now.to_date,
        rate_cents: 2400,
        period: :hourly,
        employee_number: "EMP-SEED01",
        notes: "Extended after strong interview. Includes weekend differential discussion.",
      })
      offered_applicant.make_offer! if offered_applicant.may_make_offer?
    end

    Rails.logger.info "[seeds] employees + facilitator/director/attendant users + HR sample data"
  end

end
