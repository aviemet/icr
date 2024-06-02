if Rails.env.development?

  if User.count == 0
    user = User.create({
      email: "aviemet@gmail.com",
      password: "Complex1!",
      confirmed_at: Date.new,
      time_zone: "America/Los_Angeles"
    })

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
    6.times do
      FactoryBot.create :client
    end
  end

  if Employee.count == 0
    6.times do |i|
      FactoryBot.create :employee, job_title: JobTitle.find((i % 3) + 1)
    end
  end

  if Household.count == 0
    h = Household.create({ name: "Test Household" })
    h.clients << Client.first
    h.clients << Client.second
  end

end
