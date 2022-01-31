if Rails.env == "development"

	if User.count == 0
		user = User.create({
			email: "aviemet@gmail.com",
			password: "Complex1!",
			confirmed_at: Date.new,
			time_zone: "America/Los_Angeles"
		})
		Person.create({
			f_name: "Avram",
			m_name: "True",
			l_name: "Walden",
			user: user
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
	end

	if Household.count == 0
		h = Household.create({ name: "Test Household" })
		h.clients << Clients.first
		h.clients << Clients.second
	end

end