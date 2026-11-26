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

  demo_client = Client.first
  if demo_client.present? && !demo_client.portrait.attached?
    portrait_path = Rails.root.join("db/seeds/files/demo_client_portrait.png")
    demo_client.portrait.attach(
      io: File.open(portrait_path),
      filename: "demo-portrait.png",
      content_type: "image/png",
    )
    Rails.logger.info "[seeds] attached demo portrait to #{demo_client.slug}"
  end

  if Employee.none?
    ActiveRecord::Base.transaction do
      facilitator_job = Employee::JobTitle.find_by(slug: "facilitator")
      facilitators = [
        "facilitator@gmail.com",
        "facilitator2@gmail.com",
        "facilitator3@gmail.com",
      ].map { |email|
        facilitator_user = User.create({
          email: email,
          password: dev_password,
          confirmed_at: Time.zone.now,
          time_zone: test_timezone,
          person: FactoryBot.create(:person)
        })

        facilitator = FactoryBot.create(:employee, {
          person: facilitator_user.person,
          status: :employed
        })

        facilitator.assign_job_title(facilitator_job)
        FactoryBot.create(:pay_rate, :active, employee: facilitator)
        FactoryBot.create(:address, contact: facilitator.person.contact, category: Category.type("Contact::Address").sample)
        FactoryBot.create(:phone, contact: facilitator.person.contact, category: Category.type("Contact::Phone").sample)
        facilitator
      }
      facilitator = facilitators.first

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
      facilitators.each do |managed_facilitator|
        FactoryBot.create(
          :employees_manager,
          employee: managed_facilitator,
          manager: director,
          primary: true,
        )
      end
      FactoryBot.create(:pay_rate, :active, employee: attendant)
      FactoryBot.create(:employee_credential, employee: attendant, expires_on: 20.days.from_now)
      FactoryBot.create(:employee_clearance, employee: attendant)
      FactoryBot.create(:employee_support_contact, employee: attendant)

      if Client.any?
        FactoryBot.create(:clients_attendant, attendant: attendant, client: Client.first)
        Client.find_each.with_index do |client, index|
          FactoryBot.create(:clients_manager, manager: facilitators[index % facilitators.length], client: client)
        end
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

      FactoryBot.create(
        :time_off_request,
        employee: attendant,
        kind: :pto,
        starts_at: 2.weeks.from_now.change(hour: 9),
        ends_at: 2.weeks.from_now.change(hour: 17),
        hours: 8.0,
        status: :pending,
      )

      sick_starts = 1.week.ago.change(hour: 9)
      TimeOff::RecordManagerLeave.call(
        employee: attendant,
        kind: :sick,
        starts_at: sick_starts,
        ends_at: sick_starts + 8.hours,
        hours: 8.0,
        user: facilitator.person.user,
      )

      holiday_starts = 3.days.ago.change(hour: 9)
      TimeOff::CreateLeaveShift.call(
        employee: attendant,
        service_type_slug: "holiday",
        starts_at: holiday_starts,
        ends_at: holiday_starts + 8.hours,
        name: "Holiday leave",
      )
    end

    Rails.logger.info "[seeds] employees + 3 facilitators/director/attendant users + HR sample data"
  end

  if Doctor.none? && Client.any?
    phone_category = Category.type("Contact::Phone").find_by(name: "Office") ||
      Category.type("Contact::Phone").sample

    primary_care = FactoryBot.create(
      :doctor,
      specialty: "Family Medicine",
      npi: "1234567890",
      practice_name: "Valley Primary Care",
      notes: "Preferred PCP for medication reviews.",
    )
    FactoryBot.create(:phone, contact: primary_care.person.contact, category: phone_category)

    psychiatrist = FactoryBot.create(
      :doctor,
      specialty: "Psychiatry",
      npi: "1987654321",
      practice_name: "Coast Behavioral Health",
      notes: "Handles psychotropic medications.",
    )
    FactoryBot.create(:phone, contact: psychiatrist.person.contact, category: phone_category)

    clients = Client.order(:created_at).to_a
    doctors = [primary_care, psychiatrist]

    clients.each_with_index do |client, index|
      doctor = doctors[index % doctors.length]
      FactoryBot.create(
        :doctors_client,
        client: client,
        doctor: doctor,
        notes: index.even? ? "Primary care physician" : "Psychiatry / behavioral health",
      )

      client.diagnoses.where(doctor_id: nil).find_each do |diagnosis|
        diagnosis.update!(doctor_id: doctor.id)
      end

      lisinopril = Medication.find_or_create_by!(name: "Lisinopril") do |medication|
        medication.generic_name = "lisinopril"
      end
      sertraline = Medication.find_or_create_by!(name: "Sertraline") do |medication|
        medication.generic_name = "sertraline"
      end

      active_dosage = FactoryBot.create(
        :dosage,
        amount: 10,
        amount_unit: :mg,
        freq_amount: 1,
        freq_period: :day,
        administration_method: :oral,
      )
      FactoryBot.create(
        :prescription,
        :active,
        client: client,
        doctor: doctor,
        medication: index.even? ? lisinopril : sertraline,
        dosage: active_dosage,
      )

      next unless index.zero?

      historical_dosage = FactoryBot.create(
        :dosage,
        amount: 5,
        amount_unit: :mg,
        freq_amount: 1,
        freq_period: :day,
        administration_method: :oral,
      )
      FactoryBot.create(
        :prescription,
        :historical,
        client: client,
        doctor: primary_care,
        medication: lisinopril,
        dosage: historical_dosage,
      )
    end

    facilitator = User.find_by(email: "facilitator@gmail.com")&.person&.employee
    director = User.find_by(email: "director@gmail.com")&.person&.employee
    first_client = clients.first
    hospitalization_category = Category.type("IncidentReport").find_by(name: "Hospitalizations") ||
      Category.type("IncidentReport").first

    if facilitator && director && first_client && hospitalization_category
      incident = FactoryBot.create(
        :incident_report,
        client: first_client,
        doctor: primary_care,
        category: hospitalization_category,
        reported_by_employee: facilitator,
        reported_to_employee: director,
        location: first_client.preferred_hospital.presence || "County General ER",
        description: "Client transported for evaluation after a fall at home.",
        occurred_at: 3.days.ago,
        reported_at: 3.days.ago,
      )

      FactoryBot.create(
        :client_hospital_visit,
        client: first_client,
        doctor: primary_care,
        incident_report: incident,
        hospital_name: first_client.preferred_hospital.presence || "County General",
        admitted_at: 3.days.ago,
        discharged_at: 2.days.ago,
        reason: "Fall evaluation / observation",
        notes: "Cleared for return home with increased attendant support.",
      )
    end

    second_client = clients.second
    if second_client
      FactoryBot.create(
        :client_hospital_visit,
        client: second_client,
        doctor: psychiatrist,
        hospital_name: "Regional Medical Center",
        admitted_at: 2.weeks.ago,
        discharged_at: 12.days.ago,
        reason: "Medication adjustment",
        notes: "Psych consult completed; dosage changed on discharge.",
      )
    end

    Rails.logger.info "[seeds] doctors (2) + client links, prescriptions, diagnoses, incidents, hospital visits"
  end

  if Employee.any? && Client.any? && Requirement::Type.any?
    attendant_job = Employee::JobTitle.find_by(slug: "attendant")
    onboarding_type = Requirement::Type.find_by!(name: "Onboarding")
    certification_type = Requirement::Type.find_by!(name: "Certification")
    first_client = Client.order(:created_at).first
    attendant = User.find_by(email: "attendant@gmail.com")&.person&.employee
    facilitator = User.find_by(email: "facilitator@gmail.com")&.person&.employee
    offered_applicant = Employee.where(status: :offered).order(:created_at).last

    if attendant_job && facilitator && !facilitator.credentials.exists?(credential_type: :drivers_license)
      FactoryBot.create(
        :employee_credential,
        employee: facilitator,
        name: "Driver License",
        credential_type: :drivers_license,
        number: "DL-FACILITATOR",
        expires_on: 2.years.from_now,
      )
    end

    if attendant_job
      dl_requirement = Requirement::Requirement.find_or_create_by!(name: "Driver's License") do |record|
        record.description = "Valid driver's license required before employment as an attendant."
        record.requirement_type = onboarding_type
        record.scope = attendant_job
        record.enforcement = :employment
      end
      dl_requirement.update!(enforcement: :employment, scope: attendant_job) if dl_requirement.persisted?
      dl_requirement.sync_credential_types!(["drivers_license"])
    end

    if first_client
      protocol_training = Employee::Training.find_or_create_by!(name: "Household Protocol - #{first_client.name}") do |record|
        record.description = "Client-specific household protocol for #{first_client.name}"
        record.estimated_minutes = 45
        record.status = :active
      end

      ClientsTraining.find_or_create_by!(client: first_client, training: protocol_training) do |row|
        row.required = true
      end.tap { |row| row.update!(required: true) if row.persisted? && !row.required? }

      protocol_requirement = Requirement::Requirement.find_or_create_by!(name: "Client Protocol - #{first_client.name}") do |record|
        record.description = "Complete household protocol training before scheduling with this client."
        record.requirement_type = onboarding_type
        record.scope = first_client
        record.enforcement = :client_schedule
      end
      protocol_requirement.update!(enforcement: :client_schedule, scope: first_client)
      protocol_requirement.sync_training_ids!([protocol_training.id])

      if attendant
        Employee::EmployeesTraining.find_or_create_by!(employee: attendant, training: protocol_training) do |row|
          row.started_at = Time.current
          row.completed_at = Time.current
        end.tap do |row|
          row.update!(completed_at: Time.current) if row.completed_at.blank?
        end
      end

      if facilitator
        Employee::EmployeesTraining.find_or_create_by!(employee: facilitator, training: protocol_training) do |row|
          row.started_at = Time.current
          row.completed_at = Time.current
        end.tap do |row|
          row.update!(completed_at: Time.current) if row.completed_at.blank?
        end
      end
    end

    if attendant_job
      first_aid_requirement = Requirement::Requirement.find_or_create_by!(name: "First Aid on File") do |record|
        record.description = "First Aid credential on file for attendants (advisory)."
        record.requirement_type = certification_type
        record.scope = attendant_job
        record.enforcement = :advisory
      end
      first_aid_requirement.update!(enforcement: :advisory, scope: attendant_job)
      first_aid_requirement.sync_credential_types!(["first_aid"])
    end

    Rails.logger.info "[seeds] requirement gates (DL employment, client protocol, First Aid advisory)"
    Rails.logger.info "[seeds] offered applicant without DL: #{offered_applicant&.person&.name}" if offered_applicant
  end

end
